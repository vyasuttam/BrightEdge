import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const CourseCertificatePage = () => {
  const { course_id } = useParams();

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [courseName, setCourseName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');
  const [date, setDate] = useState('');

  const certificateRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString());
    getCertificationData();
  }, []);

  const getCertificationData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/course/course-certificate-data?course_id=${course_id}`,
        {
          withCredentials: true,
        }
      );

      console.log('Certificate Data:', res.data);

      const data = res.data.certificateData;
      setStudentName(data.student_name || 'Student');
      setStudentEmail(data.student_email || '');
      setCourseName(data.course_name || 'Your Course');
      setInstructorName(data.instructor_name || 'Instructor');
      setInstructorEmail(data.instructor_email || '');
    } catch (error) {
      console.error('❌ Error fetching certificate data:', error.message);
    }
  };

  const downloadCertificateAsPDF = async () => {
    const element = certificateRef.current;

    const scale = 2; // High resolution
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${studentName}-certificate.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div
        ref={certificateRef}
        className="bg-white shadow-xl rounded-lg p-10 w-full max-w-3xl text-center border-4 border-blue-600"
      >
        <h1 className="text-4xl font-bold text-blue-700 mb-2">Certificate of Completion</h1>
        <p className="text-gray-600 mb-8">This is to certify that</p>

        <h2 className="text-3xl font-semibold mb-1">{studentName}</h2>
        <p className="text-gray-500 text-sm mb-4">{studentEmail}</p>

        <p className="text-gray-600 mb-4">has successfully completed the course</p>

        <h3 className="text-2xl font-bold text-blue-500 mb-1">{courseName}</h3>

        <p className="text-gray-600 mt-6">
          Date of Completion: <strong>{date}</strong>
        </p>

        <div className="mt-10 border-t pt-4 flex justify-center gap-16 text-gray-700 text-sm">
          <div>
            <p className="font-semibold">{instructorName}</p>
            <p className="text-gray-500 text-xs">{instructorEmail}</p>
            <div className="w-40 h-1 bg-gray-400 mt-1"></div>
            <p className="mt-1">Instructor</p>
          </div>
        </div>
      </div>

      <button
        onClick={downloadCertificateAsPDF}
        className="mt-10 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
};
