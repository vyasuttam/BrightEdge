import { sendMail, sendMailForExamEnrollment } from "../email/sendMail.js";
import { Exam, ExamEnrollment, ExamResult, Question, UserAnswers } from "../models/exam.model.js";
import { user } from "../models/user.model.js";
import crypto from 'crypto';

export const createExam = async (req, res) => {

    try {
        const { exam_name, exam_description, exam_start_time, exam_duration, total_questions, passing_marks } = req.body;
        const user_id = req.user_id;

        const examObj = await Exam.create({
            exam_name: exam_name,
            exam_duration: Number(exam_duration),
            total_questions: Number(total_questions),
            passing_marks: Number(passing_marks),
            exam_description: exam_description,
            exam_start_time: exam_start_time,
            user_id: user_id,
        });

        res.status(200).json({ success: true, examObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const getAllExams = async (req, res) => {

    try {

        let exams = await Exam.find({}).populate('user_id');

        // console.log(exams);

        return res.status(200).json({ success: true, exams });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const getExamData = async (req, res) => {

    try {

        const { examId } = req.params;

        const examObj = await Exam.findOne({
            _id: examId,
        });

        // console.log(examObj)

        if (!examObj) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        return res.status(200).json({ success: true, examObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const getConductorExams = async (req, res) => {

    try {

        const exams = await Exam.find({
            user_id: req.user_id,
        });

        return res.status(200).json({ success: true, exams });

    } catch (error) {
        console.error('Error creating exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}


export const addQuestion = async (req, res) => {
    try {

        const { question, options, answer, exam_id } = req.body;

        const questionObj = await Question.create({
            question: question,
            options: options,
            answer: answer,
            exam_id: exam_id,
        });

        res.status(200).json({ success: true, questionObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const getAllQuestions = async (req, res) => {

    try {

        const { exam_id } = req.body;
        const user_id = req.user_id;

        console.log("exam_id = ", exam_id);

        const examObj = await Exam.findOne({
            _id: exam_id,
        });

        // console.log(examObj);
        
        let questions = [];

        if(examObj) {
            questions = await Question.find({
                exam_id: exam_id,
            });
        }
        else {
            questions = await Question.find({
                exam_id: exam_id,
            }).select('-__v -answer -createdAt -updatedAt');
        }

        res.status(200).json({ success: true, questions, examObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const updateQuestion = async (req, res) => {

    try {

        const { question_id, question, options, answer } = req.body;

        const questionObj = await Question.findOneAndUpdate({
            _id: question_id,
        }, {
            question: question,
            options: options,
            answer: answer,
        }, {
            new: true,
        });

        return res.status(200).json({ success: true, questionObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const submitAnswers = async (req, res) => {
    try {

        const { exam_id, answers } = req.body;
        const user_id = req.user_id;

        // console.log("------------------------------------");
        // console.log(typeof answers);

        const isUserAlreadySubmitted = await ExamResult.findOne({
            user_id: user_id,
            exam_id: exam_id,
        });

        if (isUserAlreadySubmitted) {
            return res.status(400).json({ success: false, status : "ALREADY_SUBMITTED"  ,message: 'You have already submitted the exam' });
        }

        const userAnswersObj = await UserAnswers.create({
            user_id: user_id,
            exam_id: exam_id,
            answers: answers,
        });

        let correctAnswers = 0;

        for (let [key, value] of Object.entries(answers)) {

            const questionObj = await Question.findOne({
                _id: key,
            });

            if (questionObj.answer.toLowerCase() === value.toLowerCase()) {
                correctAnswers++;
            }
        }

        // console.log("correct answers = ", correctAnswers);

        const examObj = await Exam.findOne({
            _id: exam_id
        });

        const examResultObj = await ExamResult.create({
            user_id: user_id,
            exam_id: exam_id,
            correct_answers: correctAnswers,
            total_answers: examObj.total_questions,
            score: (correctAnswers / examObj.total_questions) * 100,
        });

        res.status(200).json({ success: true, status : "SUBMITTED" ,userAnswersObj, examResultObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false ,message: 'Internal server error' });
    }
}

export const getExamResult = async (req, res) => {
    try {
      const { exam_id } = req.body;
      const user_id = req.user_id;
  
      const examResultDoc = await ExamResult.findOne({
        user_id: user_id,
        exam_id: exam_id,
      })
        .populate('exam_id') // Populates the Exam document
        .populate('user_id'); // Populates the User document

    if(!examResultDoc) {
        return res.status(400).json({
            success : false,
            message : "user doesn't given exam"
        });
    }
      
      const conductedBy = await user.findOne({
        _id: examResultDoc.exam_id.user_id,
      }).select('full_name');

    //   console.log("conductedBy = ", conductedBy);

      const examResultObj = examResultDoc.toObject(); // Convert Mongoose document to plain object
      examResultObj.conducted_by = conductedBy;

      if (!examResultObj) {
        return res.status(404).json({ success: false, message: 'Exam result not found' });
      }
  
      res.status(200).json({ success: true, examResultObj });
  
    } catch (error) {
      console.error('Error fetching exam result:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const isExamStarted = async (req, res) => {

    try {
        const { exam_id } = req.body;

        const examObj = await Exam.findOne({
            _id: exam_id,
        });

        if (!examObj) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        const currentTime = new Date();
        const examStartTime = new Date(examObj.exam_start_time);

        if (currentTime >= examStartTime) {
            return res.status(200).json({ success: true, started: true });
        } else {
            return res.status(200).json({ success: true, started: false });
        }

    } catch (error) {
        console.error('Error creating exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const getUpcomingExams = async (req, res) => {

    try {

        const exams = await Exam.find({
            user_id: user_id,
            exam_start_time: { $gt: new Date() },
        });

        return res.status(200).json({ success: true, exams });

    } catch (error) {
        console.error('Error creating exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const getPastExams = async (req, res) => {

    try {

        const exams = await Exam.find({
            user_id: user_id,
            exam_start_time: { $lt: new Date() },
        });

        return res.status(200).json({ success: true, exams });

    } catch (error) {
        console.error('Error creating exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}
  

export const enrollInExam = async (req, res) => {  

    try {
        
        const { exam_id } = req.body;
        const user_id = req.user_id;

        const examObj = await Exam.findOne({
            _id: exam_id,
        });

        if (!examObj) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }
        
        const userData = await user.findOne({
            _id : user_id
        });

        const currentTime = new Date();
        const examStartTime = new Date(examObj.exam_start_time);

        if (currentTime >= examStartTime) {
            return res.status(400).json({ success: false, message: 'Exam already started' });
        }

        const examUsername = generateRandomString(10);
        const examPassword = generateRandomString(6);

        const examData = {
            title : examObj.exam_name,
            date : examObj.exam_start_time.toDateString(),
            time : examObj.exam_start_time.toTimeString(),
            examUsername,
            examPassword
        }

        sendMailForExamEnrollment(userData, examData);

        await ExamEnrollment.create({
            user_id: user_id,
            exam_id: exam_id,
            exam_username : examUsername,
            exam_password : examPassword
        });


        // Add logic to enroll the user in the exam

        return res.status(200).json({ success: true, message: 'Enrolled successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const handleEnrolledExamLogin = async (req, res) => {

    try
    {
        const { exam_id, examUsername, examPassword } = req.body;
        const user_id = req.user_id;

        const examEnrollment = await ExamEnrollment.findOne({
            exam_id : exam_id,
            user_id  : user_id
        });

        if(!examEnrollment) {
            return res.status(400).json({ success: false, message: "not enrolled in exam" });
        }

        if(!(examUsername == examEnrollment.exam_username && examPassword == examEnrollment.exam_password)) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }
        
        return res.status(200).json({ success: true, message : "valid credentials" });

    }
    catch(error) {

        return res.status(400).json({ success: false, message: error.message });

    }

        
}

export const getEnrolledExams = async (req, res) => {
    
    try {
        const user_id = req.user_id;

        const enrolledExams = await ExamEnrollment.find({
            user_id: user_id,
          }).populate({
            path: 'exam_id',
            populate: {
              path: 'user_id', // Assuming 'user' is the field in Exam model pointing to the creator
              select: 'full_name email', // Adjust based on your User model fields
            },
          });

        //   console.log(enrolledExams);

        const enrolledWithStatus = await Promise.all(

            enrolledExams.map(async (enrollment) => {
              const result = await ExamResult.findOne({
                user_id: user_id,
                exam_id: enrollment.exam_id._id,
              });
          
              // Add a status field to exam_id (populated document)
              const enrollmentWithStatus = {
                ...enrollment.toObject(),
                exam_id: {
                  ...enrollment.exam_id.toObject(),
                  status: result ? 'completed' : 'pending',
                },
              };
          
              return enrollmentWithStatus;
            })
          );
    
        return res.status(200).json({ success: true, enrolledExams : enrolledWithStatus });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const getUserExamStatus = async (req, res) => {

    try {
        const user_id = req.user_id;
        const { exam_id } = req.body;

        const examResult = await ExamResult.findOne({
            user_id: user_id,
            exam_id: exam_id,
        });

        if (examResult) {
            return res.status(200).json({ success: false, message: 'User not enrolled in this exam' });
        }

        return res.status(200).json({ success: true, enrolled: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}

export const updateExam = async (req, res) => {

    try {
        const { exam_name, exam_description, exam_start_time, exam_duration, total_questions, passing_marks } = req.body;
        const user_id = req.user_id;
        const { examId : exam_id } = req.params;

        // console.log(exam_start_time);   

        const examObj = await Exam.findOneAndUpdate({
            _id: exam_id,
            user_id: user_id,
        }, {
            exam_name: exam_name,
            exam_duration: Number(exam_duration),
            total_questions: Number(total_questions),
            passing_marks: Number(passing_marks),
            exam_description: exam_description,
            exam_start_time: exam_start_time,
        }, {
            new: true,
        });

        // console.log("examObj = ", examObj);

        res.status(200).json({ success: true, examObj });

    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const deleteExam = async (req, res) => {

    try {
        
        const { examId : exam_id } = req.params;
        const user_id = req.user_id;

        const examObj = await Exam.findOne({
            _id: exam_id,
            user_id: user_id,
        });

        const currentTime = new Date();
        const examStartTime = new Date(examObj.exam_start_time);
        const duration = examObj.exam_duration * 60 * 1000; // Convert duration to milliseconds

        if ((currentTime >= examStartTime) && (currentTime <= examStartTime + duration)) {
            return res.status(400).json({ success: false, message: 'Exam already started' });
        }  
    
        await Exam.deleteOne({ _id: exam_id });
        await Question.deleteMany({ exam_id: exam_id });
        await UserAnswers.deleteMany({ exam_id: exam_id });
        await ExamResult.deleteMany({ exam_id: exam_id });
        await ExamEnrollment.deleteMany({ exam_id: exam_id });  

        return res.status(200).json({ success: true, message: 'Exam deleted successfully' });

    } catch (error) {
        console.error('Error deleting exam:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const submissionInfo = async (req, res) => {

    try {
        const { examId : exam_id } = req.params;
        const user_id = req.user_id;

        const submissionInfo = await ExamResult.find({
            exam_id: exam_id,
        }).populate('user_id');

        if (!submissionInfo) {
            return res.status(400).json({ success: false, message: 'Submission not found' });
        }

        return res.status(200).json({ success: true, submissionInfo });

    } catch (error) {
        console.error('Error fetching submission info:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

export const deleteExamQuestion = async (req, res) => {

    try {
        
        const { questionId } = req.params;

        if(!questionId) {
            return res.status(400).json({ success: false, message: "question id isn't valid" });
        }

        await Question.deleteOne({
            _id : questionId
        });

        return res.status(200).json({ success: true, message: "question deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message : error.message || "something went wrong from backend" });
    }

}