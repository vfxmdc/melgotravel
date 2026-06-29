'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './style.module.scss';

// List of all 58 Algerian Wilayas for the select input
const WILAYAS = [
  '01 - Adrar', '02 - Chlef', '03 - Laghouat', '04 - Oum El Bouaghi', '05 - Batna',
  '06 - Béjaïa', '07 - Biskra', '08 - Béchar', '09 - Blida', '10 - Bouira',
  '11 - Tamanrasset', '12 - Tébessa', '13 - Tlemcen', '14 - Tiaret', '15 - Tizi Ouzou',
  '16 - Alger', '17 - Djelfa', '18 - Jijel', '19 - Sétif', '20 - Saïda',
  '21 - Skikda', '22 - Sidi Bel Abbès', '23 - Annaba', '24 - Guelma', '25 - Constantine',
  '26 - Médéa', '27 - Mostaganem', '28 - M\'Sila', '29 - Mascara', '30 - Ouargla',
  '31 - Oran', '32 - El Bayadh', '33 - Illizi', '34 - Bordj Bou Arréridj', '35 - Boumerdès',
  '36 - El Tarf', '37 - Tindouf', '38 - Tissemsilt', '39 - El Oued', '40 - Khenchela',
  '41 - Souk Ahras', '42 - Tipaza', '43 - Mila', '44 - Aïn Defla', '45 - Naâma',
  '46 - Aïn Témouchent', '47 - Ghardaïa', '48 - Relizane', '49 - El M\'Ghair', '50 - El Meniaa',
  '51 - Ouled Djellal', '52 - Bordj Badji Mokhtar', '53 - Béni Abbès', '54 - In Salah',
  '55 - In Guezzam', '56 - Touggourt', '57 - Djanet', '58 - El M\'Ghaier'
];

const MotionDiv = motion.div as any;

const formatToDateMask = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length <= 2) {
    return cleanValue;
  }
  if (cleanValue.length <= 4) {
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
  }
  return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}/${cleanValue.slice(4, 8)}`;
};

const parseMaskedDate = (value: string): Date | null => {
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
};

interface FormState {
  fullName: string;
  phone: string;
  wilaya: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  wilaya?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  travelers?: string;
}

export default function TravelInquiry() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    phone: '',
    wilaya: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    travelers: '1',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [todayStr, setTodayStr] = useState('');

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<any>, { once: true, margin: '-100px' });

  // Get current date string for input min constraints (runs on mount on client)
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setTodayStr(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when field is modified
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = formatToDateMask(value);
    setForm((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (form.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!form.wilaya) {
      newErrors.wilaya = 'Please select your Wilaya';
    }

    if (!form.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    const depDate = parseMaskedDate(form.departureDate);
    if (!form.departureDate) {
      newErrors.departureDate = 'Departure date is required / تاريخ الذهاب مطلوب';
    } else if (!depDate) {
      newErrors.departureDate = 'Enter a valid date (DD/MM/YYYY) / أدخل تاريخاً صحيحاً';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (depDate < today) {
        newErrors.departureDate = 'Departure date cannot be in the past / لا يمكن أن يكون التاريخ في الماضي';
      }
    }

    const retDate = parseMaskedDate(form.returnDate);
    if (!form.returnDate) {
      newErrors.returnDate = 'Return date is required / تاريخ العودة مطلوب';
    } else if (!retDate) {
      newErrors.returnDate = 'Enter a valid date (DD/MM/YYYY) / أدخل تاريخاً صحيحاً';
    } else if (depDate && retDate < depDate) {
      newErrors.returnDate = 'Return date cannot be before departure date / تاريخ العودة لا يمكن أن يسبق تاريخ الذهاب';
    }

    const numTravelers = parseInt(form.travelers, 10);
    if (!form.travelers) {
      newErrors.travelers = 'Number of travelers is required';
    } else if (isNaN(numTravelers) || numTravelers < 1) {
      newErrors.travelers = 'Must be at least 1 traveler';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          wilaya: form.wilaya,
          destination: form.destination.trim(),
          departureDate: form.departureDate,
          returnDate: form.returnDate,
          travelers: parseInt(form.travelers, 10),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setForm({
          fullName: '',
          phone: '',
          wilaya: '',
          destination: '',
          departureDate: '',
          returnDate: '',
          travelers: '1',
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage('Network error. Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  const titleVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
  };

  const cardVariants = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 } },
  };

  return (
    <section id="travel-inquiry" ref={ref} className={styles.travelInquirySection}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      >
        <source src="/images/ddddd.mp4" type="video/mp4" />
      </video>
      <div className={styles.container}>
        <MotionDiv
          className={styles.header}
          variants={titleVariants}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          <h2 className={styles.title}>Fill the form - أدخل معلوماتك</h2>
        </MotionDiv>

        <MotionDiv
          className={styles.formCard}
          variants={cardVariants}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          {status === 'success' ? (
            <MotionDiv
              className={styles.notification}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className={`${styles.notification} ${styles.success}`}>
                <div className={styles.notiIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className={styles.notiContent}>
                  <span className={styles.notiTitle}>Submission Successful! / تم إرسال الطلب بنجاح!</span>
                  <span className={styles.notiDesc}>
                    Thank you for planning your journey with Melgo Travel. A travel specialist will contact you on your phone shortly.
                    <br />
                    شكراً لتخطيط رحلتك مع ميلغو ترافل. سيتصل بك خبير سفر قريباً على رقم هاتفك.
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button onClick={handleReset} className={styles.resetBtn}>
                  Plan Another Journey / خطط لرحلة أخرى
                </button>
              </div>
            </MotionDiv>
          ) : (
            <form onSubmit={handleSubmit} className={styles.formGrid}>
              {/* Full Name */}
              <div className={styles.formGroup}>
                <label htmlFor="fullName" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    Full Name
                  </span>
                  <span className={styles.labelArabic}>الاسم الكامل</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe / الاسم الكامل"
                    disabled={isSubmitting}
                    className={`${styles.input} ${errors.fullName ? styles.errorInput : ''}`}
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  {errors.fullName && (
                    <span id="fullName-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.fullName}
                    </span>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    Phone Number
                  </span>
                  <span className={styles.labelArabic}>رقم الهاتف</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +213 555 12 34 56 / رقم الهاتف"
                    disabled={isSubmitting}
                    className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <span id="phone-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Wilaya */}
              <div className={styles.formGroup}>
                <label htmlFor="wilaya" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    Wilaya
                  </span>
                  <span className={styles.labelArabic}>الولاية</span>
                </label>
                <div className={styles.inputWrapper}>
                  <select
                    id="wilaya"
                    name="wilaya"
                    value={form.wilaya}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`${styles.select} ${errors.wilaya ? styles.errorInput : ''}`}
                    aria-invalid={errors.wilaya ? 'true' : 'false'}
                    aria-describedby={errors.wilaya ? 'wilaya-error' : undefined}
                  >
                    <option value="">Select your Wilaya / اختر الولاية</option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && (
                    <span id="wilaya-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.wilaya}
                    </span>
                  )}
                </div>
              </div>

              {/* Desired Destination */}
              <div className={styles.formGroup}>
                <label htmlFor="destination" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </span>
                    Desired Destination
                  </span>
                  <span className={styles.labelArabic}>الوجهة المطلوبة</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="e.g. Paris, Maldives, Tokyo / الوجهة المفضلة"
                    disabled={isSubmitting}
                    className={`${styles.input} ${errors.destination ? styles.errorInput : ''}`}
                    aria-invalid={errors.destination ? 'true' : 'false'}
                    aria-describedby={errors.destination ? 'destination-error' : undefined}
                  />
                  {errors.destination && (
                    <span id="destination-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.destination}
                    </span>
                  )}
                </div>
              </div>

              {/* Departure Date */}
              <div className={styles.formGroup}>
                <label htmlFor="departureDate" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    Departure Date
                  </span>
                  <span className={styles.labelArabic}>تاريخ الذهاب</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="departureDate"
                    name="departureDate"
                    placeholder="DD/MM/YYYY / يوم/شهر/سنة"
                    maxLength={10}
                    value={form.departureDate}
                    onChange={handleDateChange}
                    disabled={isSubmitting}
                    className={`${styles.input} ${errors.departureDate ? styles.errorInput : ''}`}
                    aria-invalid={errors.departureDate ? 'true' : 'false'}
                    aria-describedby={errors.departureDate ? 'departureDate-error' : undefined}
                  />
                  {errors.departureDate && (
                    <span id="departureDate-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.departureDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Return Date */}
              <div className={styles.formGroup}>
                <label htmlFor="returnDate" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    Return Date
                  </span>
                  <span className={styles.labelArabic}>تاريخ العودة</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="returnDate"
                    name="returnDate"
                    placeholder="DD/MM/YYYY / يوم/شهر/سنة"
                    maxLength={10}
                    value={form.returnDate}
                    onChange={handleDateChange}
                    disabled={isSubmitting}
                    className={`${styles.input} ${errors.returnDate ? styles.errorInput : ''}`}
                    aria-invalid={errors.returnDate ? 'true' : 'false'}
                    aria-describedby={errors.returnDate ? 'returnDate-error' : undefined}
                  />
                  {errors.returnDate && (
                    <span id="returnDate-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.returnDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Number of Travelers */}
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="travelers" className={styles.label}>
                  <span className={styles.labelLeft}>
                    <span className={styles.labelIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                    Number of Travelers
                  </span>
                  <span className={styles.labelArabic}>عدد المسافرين</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    id="travelers"
                    name="travelers"
                    min="1"
                    value={form.travelers}
                    onChange={handleChange}
                    placeholder="e.g. 2 / عدد المسافرين"
                    disabled={isSubmitting}
                    className={`${styles.input} ${errors.travelers ? styles.errorInput : ''}`}
                    aria-invalid={errors.travelers ? 'true' : 'false'}
                    aria-describedby={errors.travelers ? 'travelers-error' : undefined}
                  />
                  {errors.travelers && (
                    <span id="travelers-error" className={styles.errorText}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.travelers}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className={styles.submitContainer}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles.spinner} />
                      Sending Request... / جاري إرسال الطلب...
                    </>
                  ) : (
                    'Submit Travel Details / إرسال تفاصيل السفر'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Submission Failure Notification */}
          {status === 'error' && (
            <MotionDiv
              className={`${styles.notification} ${styles.error}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.notiIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className={styles.notiContent}>
                <span className={styles.notiTitle}>Submission Failed</span>
                <span className={styles.notiDesc}>{errorMessage}</span>
              </div>
            </MotionDiv>
          )}
        </MotionDiv>
      </div>
    </section>
  );
}
