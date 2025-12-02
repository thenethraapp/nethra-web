import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Heart, Users, AlertCircle, FileText, ChevronRight, CheckCircle } from 'lucide-react';

interface ChiefComplaintFormData {
  complaint: string;
  lastEyeExam?: string;
  lastMedicalExam?: string;
  ocularHistory: string[];
  ocularHistoryOther: string;
  hasMedicalConditions?: boolean;
  medicalConditions: string[];
  medicalConditionsOther: string;
  hasFamilyOcular?: boolean;
  familyOcular: string[];
  familyOcularOther: string;
  hasFamilyMedical?: boolean;
  familyMedical: string[];
  familyMedicalOther: string;
  allergies: string;
  additionalInfo: string;
}

interface ChiefComplaintProps {
  onNext: (data: ChiefComplaintFormData) => void | Promise<void>;
  onPrevious?: () => void;
  onContinueLater: () => void | Promise<void>;
  initialData: {
    chiefComplaint?: Partial<ChiefComplaintFormData>;
  };
}

interface Section {
  id: number;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  color: string;
}

const OCULAR_HISTORY_OPTIONS = [
  'Use of recommended glasses',
  'Use of eye drops',
  'Previous eye surgery',
  'None'
] as const;

const MEDICAL_CONDITIONS_OPTIONS = [
  'Hypertension',
  'Diabetes',
  'Ulcer'
] as const;

const ChiefComplaint: React.FC<ChiefComplaintProps> = ({
  onNext,
  onPrevious,
  onContinueLater,
  initialData
}) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ChiefComplaintFormData>({
    complaint: initialData.chiefComplaint?.complaint ?? '',
    lastEyeExam: initialData.chiefComplaint?.lastEyeExam ?? '',
    lastMedicalExam: initialData.chiefComplaint?.lastMedicalExam ?? '',
    ocularHistory: initialData.chiefComplaint?.ocularHistory ?? [],
    ocularHistoryOther: initialData.chiefComplaint?.ocularHistoryOther ?? '',
    hasMedicalConditions: initialData.chiefComplaint?.hasMedicalConditions,
    medicalConditions: initialData.chiefComplaint?.medicalConditions ?? [],
    medicalConditionsOther: initialData.chiefComplaint?.medicalConditionsOther ?? '',
    hasFamilyOcular: initialData.chiefComplaint?.hasFamilyOcular,
    familyOcular: initialData.chiefComplaint?.familyOcular ?? [],
    familyOcularOther: initialData.chiefComplaint?.familyOcularOther ?? '',
    hasFamilyMedical: initialData.chiefComplaint?.hasFamilyMedical,
    familyMedical: initialData.chiefComplaint?.familyMedical ?? [],
    familyMedicalOther: initialData.chiefComplaint?.familyMedicalOther ?? '',
    allergies: initialData.chiefComplaint?.allergies ?? '',
    additionalInfo: initialData.chiefComplaint?.additionalInfo ?? ''
  });

  const totalSections = 8;

  useEffect(() => {
    if (initialData.chiefComplaint) {
      setFormData({
        complaint: initialData.chiefComplaint.complaint ?? '',
        lastEyeExam: initialData.chiefComplaint.lastEyeExam ?? '',
        lastMedicalExam: initialData.chiefComplaint.lastMedicalExam ?? '',
        ocularHistory: initialData.chiefComplaint.ocularHistory ?? [],
        ocularHistoryOther: initialData.chiefComplaint.ocularHistoryOther ?? '',
        hasMedicalConditions: initialData.chiefComplaint.hasMedicalConditions,
        medicalConditions: initialData.chiefComplaint.medicalConditions ?? [],
        medicalConditionsOther: initialData.chiefComplaint.medicalConditionsOther ?? '',
        hasFamilyOcular: initialData.chiefComplaint.hasFamilyOcular,
        familyOcular: initialData.chiefComplaint.familyOcular ?? [],
        familyOcularOther: initialData.chiefComplaint.familyOcularOther ?? '',
        hasFamilyMedical: initialData.chiefComplaint.hasFamilyMedical,
        familyMedical: initialData.chiefComplaint.familyMedical ?? [],
        familyMedicalOther: initialData.chiefComplaint.familyMedicalOther ?? '',
        allergies: initialData.chiefComplaint.allergies ?? '',
        additionalInfo: initialData.chiefComplaint.additionalInfo ?? ''
      });
    }
  }, [initialData]);

  const calculateCompletedSections = (): number => {
    let completed = 0;
    if (formData.complaint.trim()) completed++;
    if (formData.lastEyeExam || formData.lastMedicalExam) completed++;
    if (formData.ocularHistory.length > 0) completed++;
    if (formData.hasMedicalConditions !== undefined) completed++;
    if (formData.hasFamilyOcular !== undefined) completed++;
    if (formData.hasFamilyMedical !== undefined) completed++;
    if (formData.allergies.trim()) completed++;
    if (formData.additionalInfo.trim()) completed++;
    return completed;
  };

  const completedSections = calculateCompletedSections();

  const handleCheckbox = (field: keyof ChiefComplaintFormData, value: string): void => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];

    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleInputChange = <K extends keyof ChiefComplaintFormData>(
    field: K,
    value: ChiefComplaintFormData[K]
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = async (): Promise<void> => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else {
      setIsSubmitting(true);
      try {
        await onNext(formData);
      } catch (error) {
        console.error('Error submitting chief complaint:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = (): void => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    } else if (onPrevious) {
      onPrevious();
    }
  };

  const handleContinueLater = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onContinueLater();
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSection1Valid = formData.complaint.trim() !== '';
  const isSection3Valid = formData.ocularHistory.length > 0;

  const canContinue = (): boolean => {
    if (currentSection === 1) return isSection1Valid;
    if (currentSection === 3) return isSection3Valid;
    return true;
  };

  const sections: Section[] = [
    { id: 1, icon: Eye, title: 'Chief Complaint', color: '#195aff' },
    { id: 2, icon: Calendar, title: 'Examination History', color: '#1fb6ff' },
    { id: 3, icon: Eye, title: 'Ocular History', color: '#009e94' },
    { id: 4, icon: Heart, title: 'Medical History', color: '#1bc77c' },
    { id: 5, icon: Users, title: 'Family Ocular', color: '#195aff' },
    { id: 6, icon: Users, title: 'Family Medical', color: '#1fb6ff' },
    { id: 7, icon: AlertCircle, title: 'Allergies', color: '#009e94' },
    { id: 8, icon: FileText, title: 'Additional Info', color: '#1bc77c' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Progress Header */}
      <div className="border-b" style={{ borderColor: '#F0EFFA' }}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F0EFFA' }}>
                <Eye className="w-6 h-6" style={{ color: '#195aff' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                  Patient Intake Form
                </h1>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  Help us understand your eye health better
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5" style={{ color: '#1bc77c' }} />
                <span className="font-semibold" style={{ color: '#031e2d' }}>
                  {completedSections}/{totalSections}
                </span>
              </div>
              <p className="text-xs" style={{ color: '#6b7280' }}>Sections completed</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F0EFFA' }}>
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${(completedSections / totalSections) * 100}%`,
                backgroundColor: '#1bc77c'
              }}
            />
          </div>

          {/* Section Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isCompleted = section.id < currentSection ||
                (section.id === 1 && isSection1Valid) ||
                (section.id === 3 && isSection3Valid && section.id <= currentSection);
              const isCurrent = section.id === currentSection;

              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all flex-shrink-0"
                  style={{
                    backgroundColor: isCurrent ? section.color : isCompleted ? '#c0f7e4' : '#F0EFFA',
                    color: isCurrent ? '#ffffff' : isCompleted ? '#009e94' : '#6b7280',
                    opacity: isCurrent ? 1 : 0.8
                  }}
                  type="button"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{section.title}</span>
                  {isCompleted && <CheckCircle className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="rounded-2xl p-8 border-2 transition-all" style={{
          backgroundColor: '#fafafa',
          borderColor: sections[currentSection - 1].color
        }}>
          {/* Section 1: Chief Complaint */}
          {currentSection === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[0].color, opacity: 0.1 }}>
                  <Eye className="w-6 h-6" style={{ color: sections[0].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    What brings you here today?
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Tell us about your main concern <span style={{ color: '#195aff' }}>*</span></p>
                </div>
              </div>

              <textarea
                value={formData.complaint}
                onChange={(e) => handleInputChange('complaint', e.target.value)}
                placeholder="Describe your main eye concern or issue (e.g., blurry vision, eye pain, redness...)"
                className="w-full p-4 rounded-xl border-2 focus:outline-none focus:border-opacity-100 transition-all resize-none"
                style={{
                  borderColor: formData.complaint ? '#1bc77c' : '#F0EFFA',
                  backgroundColor: '#ffffff',
                  color: '#031e2d',
                  minHeight: '150px'
                }}
              />
              {formData.complaint && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#1bc77c' }}>
                  <CheckCircle className="w-4 h-4" />
                  Great! {"We've"} got your chief complaint
                </div>
              )}
            </div>
          )}

          {/* Section 2: Examination History */}
          {currentSection === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[1].color, opacity: 0.1 }}>
                  <Calendar className="w-6 h-6" style={{ color: sections[1].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Examination History
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>When did you last visit a doctor?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#031e2d' }}>
                    Last Eye Examination
                  </label>
                  <input
                    type="date"
                    value={formData.lastEyeExam}
                    onChange={(e) => handleInputChange('lastEyeExam', e.target.value)}
                    className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: formData.lastEyeExam ? '#1bc77c' : '#F0EFFA',
                      backgroundColor: '#ffffff',
                      color: '#031e2d'
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#031e2d' }}>
                    Last Medical Examination
                  </label>
                  <input
                    type="date"
                    value={formData.lastMedicalExam}
                    onChange={(e) => handleInputChange('lastMedicalExam', e.target.value)}
                    className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all"
                    style={{
                      borderColor: formData.lastMedicalExam ? '#1bc77c' : '#F0EFFA',
                      backgroundColor: '#ffffff',
                      color: '#031e2d'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Ocular History */}
          {currentSection === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[2].color, opacity: 0.1 }}>
                  <Eye className="w-6 h-6" style={{ color: sections[2].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Your Ocular History
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Select all that apply <span style={{ color: '#195aff' }}>*</span></p>
                </div>
              </div>

              <div className="space-y-3">
                {OCULAR_HISTORY_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                    style={{
                      borderColor: formData.ocularHistory.includes(option) ? '#009e94' : '#F0EFFA',
                      backgroundColor: formData.ocularHistory.includes(option) ? '#c0f7e4' : '#ffffff'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.ocularHistory.includes(option)}
                      onChange={() => handleCheckbox('ocularHistory', option)}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: '#009e94' }}
                    />
                    <span className="font-medium" style={{ color: '#031e2d' }}>{option}</span>
                    {formData.ocularHistory.includes(option) && (
                      <CheckCircle className="w-5 h-5 ml-auto" style={{ color: '#009e94' }} />
                    )}
                  </label>
                ))}

                <div className="p-4 rounded-xl border-2" style={{ borderColor: '#F0EFFA', backgroundColor: '#ffffff' }}>
                  <label className="flex items-center gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.ocularHistory.includes('Others')}
                      onChange={() => handleCheckbox('ocularHistory', 'Others')}
                      className="w-5 h-5 rounded"
                      style={{ accentColor: '#009e94' }}
                    />
                    <span className="font-medium" style={{ color: '#031e2d' }}>Others (please specify)</span>
                  </label>
                  {formData.ocularHistory.includes('Others') && (
                    <input
                      type="text"
                      value={formData.ocularHistoryOther}
                      onChange={(e) => handleInputChange('ocularHistoryOther', e.target.value)}
                      placeholder="Please specify..."
                      className="w-full p-3 rounded-lg border focus:outline-none"
                      style={{ borderColor: '#F0EFFA', backgroundColor: '#fafafa', color: '#031e2d' }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Medical History */}
          {currentSection === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[3].color, opacity: 0.1 }}>
                  <Heart className="w-6 h-6" style={{ color: sections[3].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Medical History
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Do you have any medical conditions?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasMedicalConditions', false)}
                    className="flex-1 p-4 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.hasMedicalConditions === false ? '#1bc77c' : '#F0EFFA',
                      backgroundColor: formData.hasMedicalConditions === false ? '#c0f7e4' : '#ffffff',
                      color: '#031e2d'
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasMedicalConditions', true)}
                    className="flex-1 p-4 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.hasMedicalConditions === true ? '#1bc77c' : '#F0EFFA',
                      backgroundColor: formData.hasMedicalConditions === true ? '#c0f7e4' : '#ffffff',
                      color: '#031e2d'
                    }}
                  >
                    Yes
                  </button>
                </div>

                {formData.hasMedicalConditions && (
                  <div className="space-y-3 pt-2">
                    {MEDICAL_CONDITIONS_OPTIONS.map((condition) => (
                      <label
                        key={condition}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: formData.medicalConditions.includes(condition) ? '#1bc77c' : '#F0EFFA',
                          backgroundColor: formData.medicalConditions.includes(condition) ? '#c0f7e4' : '#ffffff'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.medicalConditions.includes(condition)}
                          onChange={() => handleCheckbox('medicalConditions', condition)}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#1bc77c' }}
                        />
                        <span className="font-medium" style={{ color: '#031e2d' }}>{condition}</span>
                      </label>
                    ))}

                    <div className="p-4 rounded-xl border-2" style={{ borderColor: '#F0EFFA', backgroundColor: '#ffffff' }}>
                      <label className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formData.medicalConditions.includes('Others')}
                          onChange={() => handleCheckbox('medicalConditions', 'Others')}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#1bc77c' }}
                        />
                        <span className="font-medium" style={{ color: '#031e2d' }}>Others (please specify)</span>
                      </label>
                      {formData.medicalConditions.includes('Others') && (
                        <input
                          type="text"
                          value={formData.medicalConditionsOther}
                          onChange={(e) => handleInputChange('medicalConditionsOther', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full p-3 rounded-lg border focus:outline-none"
                          style={{ borderColor: '#F0EFFA', backgroundColor: '#fafafa', color: '#031e2d' }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 5: Family Ocular History */}
          {currentSection === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[4].color, opacity: 0.1 }}>
                  <Users className="w-6 h-6" style={{ color: sections[4].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Family Ocular History
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Any eye conditions in your family?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasFamilyOcular', false)}
                    className="flex-1 p-4 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.hasFamilyOcular === false ? '#195aff' : '#F0EFFA',
                      backgroundColor: formData.hasFamilyOcular === false ? '#F0EFFA' : '#ffffff',
                      color: '#031e2d'
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasFamilyOcular', true)}
                    className="flex-1 p-4 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.hasFamilyOcular === true ? '#195aff' : '#F0EFFA',
                      backgroundColor: formData.hasFamilyOcular === true ? '#F0EFFA' : '#ffffff',
                      color: '#031e2d'
                    }}
                  >
                    Yes
                  </button>
                </div>

                {formData.hasFamilyOcular && (
                  <div className="space-y-3 pt-2">
                    {OCULAR_HISTORY_OPTIONS.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: formData.familyOcular.includes(option) ? '#195aff' : '#F0EFFA',
                          backgroundColor: formData.familyOcular.includes(option) ? '#F0EFFA' : '#ffffff'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.familyOcular.includes(option)}
                          onChange={() => handleCheckbox('familyOcular', option)}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#195aff' }}
                        />
                        <span className="font-medium" style={{ color: '#031e2d' }}>{option}</span>
                      </label>
                    ))}

                    <div className="p-4 rounded-xl border-2" style={{ borderColor: '#F0EFFA', backgroundColor: '#ffffff' }}>
                      <label className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formData.familyOcular.includes('Others')}
                          onChange={() => handleCheckbox('familyOcular', 'Others')}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#195aff' }}
                        />
                        <span className="font-medium" style={{ color: '#031e2d' }}>Others (please specify)</span>
                      </label>
                      {formData.familyOcular.includes('Others') && (
                        <input
                          type="text"
                          value={formData.familyOcularOther}
                          onChange={(e) => handleInputChange('familyOcularOther', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full p-3 rounded-lg border focus:outline-none"
                          style={{ borderColor: '#F0EFFA', backgroundColor: '#fafafa', color: '#031e2d' }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 6: Family Medical History */}
          {currentSection === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[5].color, opacity: 0.1 }}>
                  <Users className="w-6 h-6" style={{ color: sections[5].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Family Medical History
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Any medical conditions in your family?</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasFamilyMedical', false)}
                    className="flex-1 p-4 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.hasFamilyMedical === false ? '#1fb6ff' : '#F0EFFA',
                      backgroundColor: formData.hasFamilyMedical === false ? '#F0EFFA' : '#ffffff',
                      color: '#031e2d'
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasFamilyMedical', true)}
                    className="flex-1 p-4 rounded-xl border-2 font-medium transition-all"
                    style={{
                      borderColor: formData.hasFamilyMedical === true ? '#1fb6ff' : '#F0EFFA',
                      backgroundColor: formData.hasFamilyMedical === true ? '#F0EFFA' : '#ffffff',
                      color: '#031e2d'
                    }}
                  >
                    Yes
                  </button>
                </div>

                {formData.hasFamilyMedical && (
                  <div className="space-y-3 pt-2">
                    {MEDICAL_CONDITIONS_OPTIONS.map((condition) => (
                      <label
                        key={condition}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md"
                        style={{
                          borderColor: formData.familyMedical.includes(condition) ? '#1fb6ff' : '#F0EFFA',
                          backgroundColor: formData.familyMedical.includes(condition) ? '#F0EFFA' : '#ffffff'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.familyMedical.includes(condition)}
                          onChange={() => handleCheckbox('familyMedical', condition)}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#1fb6ff' }}
                        />
                        <span className="font-medium" style={{ color: '#031e2d' }}>{condition}</span>
                      </label>
                    ))}

                    <div className="p-4 rounded-xl border-2" style={{ borderColor: '#F0EFFA', backgroundColor: '#ffffff' }}>
                      <label className="flex items-center gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={formData.familyMedical.includes('Others')}
                          onChange={() => handleCheckbox('familyMedical', 'Others')}
                          className="w-5 h-5 rounded"
                          style={{ accentColor: '#1fb6ff' }}
                        />
                        <span className="font-medium" style={{ color: '#031e2d' }}>Others (please specify)</span>
                      </label>
                      {formData.familyMedical.includes('Others') && (
                        <input
                          type="text"
                          value={formData.familyMedicalOther}
                          onChange={(e) => handleInputChange('familyMedicalOther', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full p-3 rounded-lg border focus:outline-none"
                          style={{ borderColor: '#F0EFFA', backgroundColor: '#fafafa', color: '#031e2d' }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 7: Allergies */}
          {currentSection === 7 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[6].color, opacity: 0.1 }}>
                  <AlertCircle className="w-6 h-6" style={{ color: sections[6].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Allergies
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Tell us about any allergies you have</p>
                </div>
              </div>

              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="Please indicate any allergies you have (medications, foods, environmental...)"
                className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all resize-none"
                style={{
                  borderColor: formData.allergies ? '#009e94' : '#F0EFFA',
                  backgroundColor: '#ffffff',
                  color: '#031e2d',
                  minHeight: '120px'
                }}
              />
            </div>
          )}

          {/* Section 8: Additional Information */}
          {currentSection === 8 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl" style={{ backgroundColor: sections[7].color, opacity: 0.1 }}>
                  <FileText className="w-6 h-6" style={{ color: sections[7].color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#031e2d' }}>
                    Additional Information
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Any further details you would like us to know?
                  </p>
                </div>
              </div>

              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Please provide any further details you would like us to know"
                className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all resize-none"
                style={{
                  borderColor: formData.additionalInfo ? '#1bc77c' : '#F0EFFA',
                  backgroundColor: '#ffffff',
                  color: '#031e2d',
                  minHeight: '120px'
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleContinueLater}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Later
            </button>
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : currentSection === totalSections ? 'Next Step' : 'Continue'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiefComplaint;