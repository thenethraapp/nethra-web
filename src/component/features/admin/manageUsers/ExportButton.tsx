import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';

interface User {
  _id: string;
  username?: string;
  fullName?: string;
  email: string;
  role: 'patient' | 'optometrist' | 'admin' | 'superadmin';
  isEmailVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  certificateType?: string;
  idNumber?: string;
  expiryDate?: string;
  ipInfo?: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    timezone?: string;
  },
}

interface ExportButtonProps {
  users: User[];
  activeTab: string;
}

const ExportButton = ({ users, activeTab }: ExportButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const sanitizeValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value).trim();
  };
  

  const prepareUserData = () => {
    return users.map(user => ({
      'User ID': sanitizeValue(user._id),
      'Name': sanitizeValue(user.role === 'patient' ? user.username : user.fullName || 'N/A'),
      'Email': sanitizeValue(user.email),
      'Phone': sanitizeValue(user.phone),
      'Role': user.role.charAt(0).toUpperCase() + user.role.slice(1),
      'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
      'Status': user.isSuspended ? 'Suspended' : 'Active',
      'Certificate Type': sanitizeValue(user.certificateType),
      'ID Number': sanitizeValue(user.idNumber),
      'Certificate Expiry': formatDate(user.expiryDate),
      'Created At': formatDate(user.createdAt),
      'Last Login': formatDate(user.lastLogin),
      'IP Country': sanitizeValue(user.ipInfo?.country),
      'IP City': sanitizeValue(user.ipInfo?.city)
    }));
  };

  const downloadFile = (blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  const exportToCSV = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      const data = prepareUserData();
      
      if (data.length === 0) {
        alert('No users available to export');
        return;
      }

      // Get headers
      const headers = Object.keys(data[0]);
      
      // RFC 4180 compliant CSV generation
      const escapeCSVValue = (value: string): string => {
        // If value contains comma, newline, or double quote, wrap in quotes and escape quotes
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };
      
      // Create CSV content
      const csvRows = [
        headers.map(escapeCSVValue).join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            return escapeCSVValue(String(value));
          }).join(',')
        )
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `nethra_users_${activeTab}_${timestamp}.csv`;
      
      const success = downloadFile(blob, filename);
      
      if (success) {
        setShowMenu(false);
      } else {
        alert('Failed to download CSV file. Please try again.');
      }
    } catch (error) {
      console.error('CSV Export Error:', error);
      alert('An error occurred while exporting to CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToXLSX = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      const data = prepareUserData();
      
      if (data.length === 0) {
        alert('No users available to export');
        return;
      }

      // Create worksheet from JSON data
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Auto-size columns based on content
      const maxWidth = 50;
      const colWidths = Object.keys(data[0]).map(key => {
        const maxLength = Math.max(
          key.length,
          ...data.map(row => String(row[key as keyof typeof row]).length)
        );
        return { wch: Math.min(maxLength + 2, maxWidth) };
      });
      worksheet['!cols'] = colWidths;
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
      
      // Add metadata
      workbook.Props = {
        Title: `User Export - ${activeTab}`,
        Subject: 'User Data',
        Author: 'Admin Panel',
        CreatedDate: new Date()
      };
      
      // Generate binary string
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array',
        compression: true 
      });
      
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `nethra_users_${activeTab}_${timestamp}.xlsx`;
      
      const success = downloadFile(blob, filename);
      
      if (success) {
        setShowMenu(false);
      } else {
        alert('Failed to download Excel file. Please try again.');
      }
    } catch (error) {
      console.error('XLSX Export Error:', error);
      alert('An error occurred while exporting to Excel. Please try CSV format instead.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting || users.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-vividblue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title={users.length === 0 ? 'No users to export' : 'Export user data'}
      >
        <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
        {isExporting ? 'Exporting...' : 'Export Data'}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 font-medium">
                {users.length} user{users.length !== 1 ? 's' : ''} selected
              </p>
            </div>
            
            <button
              onClick={exportToCSV}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4 text-vividblue" />
              <div className="flex-1">
                <div className="font-medium">CSV Format</div>
                <div className="text-xs text-gray-500">Compatible with Excel</div>
              </div>
            </button>
            
            <button
              onClick={exportToXLSX}
              disabled={isExporting}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4 text-vividgreen" />
              <div className="flex-1">
                <div className="font-medium">Excel Format</div>
                <div className="text-xs text-gray-500">Native .xlsx file</div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;