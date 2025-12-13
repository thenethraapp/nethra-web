import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { joinConsultation, JoinConsultationResponse } from '@/api/consultation/joinConsultation';
import { useAuth } from '@/context/AuthContext';
import { useSocketStore } from '@/store/useSocketStore';
import WheelLoader from '@/component/common/UI/WheelLoader';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle } from 'lucide-react';
import Peer, { MediaConnection } from 'peerjs';

const VideoConsultationPage = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const { user } = useAuth();
  const { socket, isConnected: socketConnected } = useSocketStore();

  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<JoinConsultationResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const connectionRef = useRef<MediaConnection | null>(null);

  // PeerJS configuration from environment variables
  const PEER_CONFIG = {
    host: process.env.NEXT_PUBLIC_PEER_HOST || 'localhost',
    port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT || '9000'),
    path: process.env.NEXT_PUBLIC_PEER_PATH || '/peerjs',
    secure: process.env.NEXT_PUBLIC_PEER_SECURE === 'true',
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    }
  };

  // Validate join permission
  useEffect(() => {
    const validateJoin = async () => {
      if (!roomId || typeof roomId !== 'string') {
        setError('Invalid room ID');
        setLoading(false);
        return;
      }

      try {
        const response = await joinConsultation(roomId);
        setPermissionStatus(response);

        if (!response.success || response.status !== 'allowed') {
          setError(response.message || 'Access denied');
          setLoading(false);
          return;
        }

        // Permission granted, initialize video
        // Wait for Socket.io connection if not ready
        if (!socketConnected || !socket) {
          setError('Socket connection not available. Please wait...');
          // Retry after a short delay
          setTimeout(() => {
            if (socket && socketConnected) {
              initializeVideo();
            } else {
              setError('Socket connection failed. Please refresh the page.');
              setLoading(false);
            }
          }, 2000);
        } else {
          await initializeVideo();
        }
      } catch (err) {
        console.error('Error validating join:', err);
        setError('Failed to validate consultation access');
        setLoading(false);
      }
    };

    if (router.isReady && user && socketConnected && socket) {
      validateJoin();
    } else if (router.isReady && user && !socketConnected) {
      // Wait for socket connection
      setLoading(true);
      const checkSocket = setInterval(() => {
        if (socketConnected && socket) {
          clearInterval(checkSocket);
          validateJoin();
        }
      }, 500);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkSocket);
        if (!socketConnected || !socket) {
          setError('Socket connection timeout. Please refresh the page.');
          setLoading(false);
        }
      }, 10000);
    }
  }, [roomId, router.isReady, user, socket, socketConnected]);

  // Initialize video and PeerJS with Socket.io signaling
  const initializeVideo = async () => {
    try {
      // Check Socket.io connection
      if (!socket || !socketConnected) {
        setError('Socket connection not available. Please refresh the page.');
        setLoading(false);
        return;
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize PeerJS with random ID
      const peerId = `user-${user?.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const peer = new Peer(peerId, PEER_CONFIG);

      peer.on('open', (id) => {
        console.log('✅ PeerJS connected with ID:', id);

        // Join consultation room via Socket.io
        socket.emit('consultation:join', {
          roomId: roomId as string,
          peerId: id
        });
      });

      peer.on('error', (err) => {
        console.error('❌ PeerJS error:', err);
        setError('Failed to establish connection. Please try again.');
        setLoading(false);
      });

      // Handle incoming call
      peer.on('call', (call) => {
        console.log('📞 Incoming call from:', call.peer);
        // Answer incoming call
        call.answer(localStreamRef.current!);

        call.on('stream', (remoteStream) => {
          console.log('✅ Remote stream received');
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setIsConnected(true);
        });

        call.on('close', () => {
          console.log('📞 Call ended');
          setRemoteStream(null);
          setIsConnected(false);
        });

        call.on('error', (err) => {
          console.error('❌ Call error:', err);
        });

        connectionRef.current = call;
      });

      peerRef.current = peer;

      // Set up Socket.io event listeners
      setupSocketListeners(peer, roomId as string);
    } catch (err) {
      console.error('❌ Error initializing video:', err);
      setError('Failed to access camera/microphone. Please check permissions.');
      setLoading(false);
    }
  };

  // Set up Socket.io event listeners for signaling
  const setupSocketListeners = (peer: Peer, roomId: string) => {
    if (!socket) return;

    // Listen for successful room join
    socket.on('consultation:joined', (data) => {
      console.log('✅ Joined consultation room:', data);
      setLoading(false);
    });

    // Listen for waiting state
    socket.on('consultation:waiting', (data) => {
      console.log('⏳ Waiting for other participant:', data.message);
      setLoading(false);
    });

    // Listen for peer ready (other participant is in room)
    socket.on('consultation:peer-ready', (data) => {
      console.log('👤 Other participant ready:', data);
      // Other participant is already in room - call them
      if (peer && localStreamRef.current && data.peerId) {
        callPeer(peer, data.peerId);
      }
    });

    // Listen for new peer joining
    socket.on('consultation:peer-joined', (data) => {
      console.log('👤 New peer joined:', data);
      // New participant joined - call them
      if (peer && localStreamRef.current && data.peerId) {
        callPeer(peer, data.peerId);
      }
    });

    // Listen for peer offer (explicit peer ID exchange)
    socket.on('consultation:peer-offer', (data) => {
      console.log('📤 Received peer offer:', data);
      // Call the peer that offered their ID
      if (peer && localStreamRef.current && data.peerId) {
        callPeer(peer, data.peerId);
      }
    });

    // Listen for peer leaving
    socket.on('consultation:peer-left', (data) => {
      console.log('👋 Peer left:', data);
      setRemoteStream(null);
      setIsConnected(false);
      if (connectionRef.current) {
        connectionRef.current.close();
        connectionRef.current = null;
      }
    });

    // Listen for errors
    socket.on('consultation:error', (data) => {
      console.error('❌ Consultation error:', data);
      setError(data.message || 'An error occurred');
      setLoading(false);
    });

    // Listen for ICE candidates
    socket.on('consultation:ice-candidate', (data) => {
      console.log('🧊 Received ICE candidate:', data);
      // Handle ICE candidate if needed
      // PeerJS handles this automatically, but we can forward if needed
    });
  };

  // Call a peer using their peer ID
  const callPeer = (peer: Peer, otherPeerId: string) => {
    if (!localStreamRef.current) {
      console.error('❌ No local stream available');
      return;
    }

    try {
      console.log(`📞 Calling peer: ${otherPeerId}`);
      const call = peer.call(otherPeerId, localStreamRef.current);

      if (!call) {
        console.error('❌ Failed to create call');
        return;
      }

      call.on('stream', (remoteStream) => {
        console.log('✅ Remote stream received from call');
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setIsConnected(true);
        setLoading(false);
      });

      call.on('close', () => {
        console.log('📞 Call closed');
        setRemoteStream(null);
        setIsConnected(false);
      });

      call.on('error', (err) => {
        console.error('❌ Call error:', err);
        setError('Failed to connect to other participant');
      });

      connectionRef.current = call;
    } catch (err) {
      console.error('❌ Error calling peer:', err);
      setError('Failed to establish connection');
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicEnabled;
      });
      setIsMicEnabled(!isMicEnabled);
    }
  };

  // Toggle camera
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // End call
  const endCall = () => {
    // Leave Socket.io room
    if (socket && roomId) {
      socket.emit('consultation:leave', { roomId: roomId as string });
    }

    // Remove Socket.io listeners
    if (socket) {
      socket.off('consultation:joined');
      socket.off('consultation:waiting');
      socket.off('consultation:peer-ready');
      socket.off('consultation:peer-joined');
      socket.off('consultation:peer-offer');
      socket.off('consultation:peer-left');
      socket.off('consultation:error');
      socket.off('consultation:ice-candidate');
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }

    // Destroy peer
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Navigate back
    router.push('/dashboard');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Leave Socket.io room
      if (socket && roomId) {
        socket.emit('consultation:leave', { roomId: roomId as string });
      }

      // Remove Socket.io listeners
      if (socket) {
        socket.off('consultation:joined');
        socket.off('consultation:waiting');
        socket.off('consultation:peer-ready');
        socket.off('consultation:peer-joined');
        socket.off('consultation:peer-offer');
        socket.off('consultation:peer-left');
        socket.off('consultation:error');
        socket.off('consultation:ice-candidate');
      }

      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Destroy peer
      if (peerRef.current) {
        peerRef.current.destroy();
      }

      // Close connection
      if (connectionRef.current) {
        connectionRef.current.close();
      }
    };
  }, [socket, roomId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <WheelLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center max-w-md px-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          {permissionStatus?.booking && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-400 mb-1">Appointment Date:</p>
              <p className="text-white">
                {new Date(permissionStatus.booking.appointmentDate).toLocaleDateString()} at{' '}
                {permissionStatus.booking.startTime}
              </p>
            </div>
          )}
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-primary-cyan text-white px-6 py-2 rounded-lg hover:bg-primary-cyan/80 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Video Container */}
      <div className="flex-1 relative flex items-center justify-center p-4">
        {/* Remote Video (Main) */}
        <div className="w-full h-full flex items-center justify-center bg-gray-950 rounded-lg overflow-hidden">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">
                  {permissionStatus?.booking?.optometrist?.name?.charAt(0) || 'D'}
                </span>
              </div>
              <p className="text-gray-400">
                Waiting for {user?.role === 'patient' ? 'optometrist' : 'patient'} to join...
              </p>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-950 rounded-lg overflow-hidden border-2 border-gray-700">
          {localVideoRef.current?.srcObject ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-2xl">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center gap-4">
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full transition-colors ${isMicEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
              }`}
            title={isMicEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {isMicEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${isVideoEnabled
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-red-600 hover:bg-red-700'
              }`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'
                }`}
            />
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultationPage;
