import React, { useState, useEffect, useCallback } from "react";
import ShowResult from "./ShowResult";
import appendices from "./data/appendices.json";
import questions from "./data/questions.json";
import Appendices from "./Appendices";

function Form() {

  const [teacherUsername, setTeacherUsername] = useState([]);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [comments, setComments] = useState(() => Array(questions.length).fill(""));

  const [pupilName, setPupilName] = useState("");
  const [date, setDate] = useState("");
  const [overrideComment, setOverrideComment] = useState("");
  const [overrideScore, setOverrideScore] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    setDate(formattedDate);
  }, []);

  const handleRadioChange = useCallback((questionIndex, answer_id) => {
    const answer = questions[questionIndex].answers.find((ans) => ans.answer_id === answer_id);
    setSelectedAnswers((prevSelected) => ({
      ...prevSelected,
      [questionIndex]: answer_id,
    }));

    setScores((prevScores) => ({
      ...prevScores,
      [questionIndex]: answer ? answer.answer_score : 0,
    }));
  }, []);

  const handleComment = (index, e) => {
    const updatedComments = [...comments];
    updatedComments[index] = e.target.value;
    setComments(updatedComments);
  };

  return (
    <>
      <table className="table">
        <tbody>
          <div className="inputField">
            <div className="textField">
              <label>Teacher Name</label>
              <input
                className="textField"
                value={teacherUsername}
                onChange={(e) => setTeacherUsername(e.target.value)}
                type="text"
                placeholder="enter teacher name"
              />
            </div>
            <div className="textField">
              <label>Pupil Name</label>
              <input
                onChange={(e) => setPupilName(e.target.value)}
                type="text"
                placeholder="enter pupil name"
                value={pupilName}
              />
            </div>
            <div className="textField">
              <label>Date</label>
              <input value={date} onChange={(e) => setDate(e.target.value)} type="date" placeholder="select date " />
            </div>
          </div>

          {questions.length === 0 ? (
            <tr>Loading...</tr>
          ) : (
            questions.map((que, index) => (
              <React.Fragment key={index}>
                {
                  <div>
                    {que.criterion_code === "1.1" || que.criterion_code === "1.2" || que.criterion_code === "7" ? (
                      <Appendices appendixData={appendices.appendices[index]} />
                    ) : null}
                    {que.criterion_code === "7" && <Appendices appendixData={appendices.appendices[2]} />}
                  </div>
                }
                <tr className="question">
                  <td colSpan="4">
                    <h3>
                      Criterion {que.criterion_code}: {que.question_text}
                    </h3>
                  </td>
                  <td colSpan="2">
                    <h3>Score </h3>
                  </td>
                </tr>
                {que.answers &&
                  que.answers.map((answer) => (
                    <tr key={answer.answer_id}>
                      <td className="answer-radio">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={"question_" + index}
                          value={answer.answer_id}
                          checked={selectedAnswers[index] === answer.answer_id}
                          onChange={() => handleRadioChange(index, answer.answer_id)}
                        />
                      </td>
                      <td colSpan="3" className="answer-text">
                        {answer.answer_text}
                      </td>
                      <td className="score" colSpan="2">
                        {answer.answer_score}
                      </td>
                    </tr>
                  ))}
                <tr>
                  <td colSpan="4" className="comment-section">
                    <span className="comments">comments</span>
                    <textarea
                      maxLength="255"
                      value={comments[index]}
                      onChange={(e) => handleComment(index, e)}
                      placeholder="Add a comment for this answer..."
                    />
                  </td>
                  <td style={{ width: "8%" }}>CYP Score</td>
                  <td>{scores[index] || 0}</td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      <ShowResult
        selectedAnswers={selectedAnswers}
        questions={questions}
        comments={comments}
        teacherName={teacherUsername}
        pupilName={pupilName}
        date={date}
        overrideComment={overrideComment}
        setOverrideComment={setOverrideComment}
        overrideScore={overrideScore}
        setOverrideScore={setOverrideScore}
      />
    </>
  );
}

export default Form;
