import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExamCertificate = ({ examResultObj }) => {
  const certificateRef = useRef(null);

  if (!examResultObj) return <div>User doesn't participated in exam</div>;

  const { user_id, exam_id, score, total_answers, correct_answers, conducted_by } = examResultObj;

  const handleDownload = async () => {
    const element = certificateRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    const imgWidthMm = imgWidthPx * 0.264583;
    const imgHeightMm = imgHeightPx * 0.264583;

    const pdf = new jsPDF({
      orientation: imgWidthMm > imgHeightMm ? 'l' : 'p',
      unit: 'mm',
      format: [imgWidthMm, imgHeightMm],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm);
    pdf.save(`${user_id.full_name}_certificate.pdf`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        ref={certificateRef}
        style={{
          maxWidth: '900px',
          width: '100%',
          background: '#fff8e1',
          padding: '50px',
          border: '10px solid #f1c40f',
          borderRadius: '20px',
          fontFamily: "'Georgia', serif",
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          textAlign: 'center',
          color: '#2c3e50',
        }}
      >
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#2c3e50' }}>
          🎓 Certificate of Completion
        </h1>

        <hr style={{ margin: '30px 0', border: '1.5px solid #f39c12' }} />

        <p style={{ fontSize: '20px', marginBottom: '10px' }}>
          This is to proudly certify that
        </p>

        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#e67e22' }}>
          {user_id.full_name}
        </h2>

        <p style={{ fontSize: '18px', marginTop: '5px', color: '#7f8c8d' }}>
          ({user_id.email})
        </p>

        <p style={{ fontSize: '20px', margin: '30px 0 10px' }}>
          has successfully completed the exam
        </p>

        <h3 style={{ fontSize: '26px', fontWeight: 'bold', color: '#2980b9' }}>
          “{exam_id.exam_name}”
        </h3>

        <p style={{ fontSize: '18px', margin: '20px 0' }}>
          held on <strong>{new Date(exam_id.exam_start_time).toLocaleDateString()}</strong> with a score of{' '}
          <strong>{score.toFixed(2)}%</strong>
          <br />
          <strong>{correct_answers}</strong> correct answers out of <strong>{total_answers}</strong>
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '16px', marginBottom: '5px' }}>Conducted By:</p>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#34495e' }}>
              {conducted_by?.full_name || 'N/A'}
            </h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '16px', marginBottom: '5px' }}>Date Issued:</p>
            <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#34495e' }}>
              {new Date().toLocaleDateString()}
            </h4>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: '#27ae60',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        }}
      >
        ⬇️ Download Certificate
      </button>
    </div>
  );
};
