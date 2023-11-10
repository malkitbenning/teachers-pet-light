import React, { useState, useEffect } from "react";
import PrintResult from "./PrintResult";
import "../styles/ShowResult.css";

function ShowResult({
  selectedAnswers,
  questions,
  comments = [],
  teacherID,
  teacherName,
  pupilID,
  setSavedPupilID,
  pupilName,
  date,
  overrideComment,
  setOverrideComment,
  overrideScore,
  setOverrideScore,
}) {
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleShowResults = () => {
    const unansweredQuestions = questions.map((_, index) => selectedAnswers[index]).some((answerId) => !answerId);

    if (unansweredQuestions || pupilName === "") {
      setShowErrorMessage(true);
    } else {
      setShowErrorMessage(false);
      setShowResults(true);
    }
  };

  useEffect(() => {
    let score = 0;
    for (let questionIndex in selectedAnswers) {
      const answerId = selectedAnswers[questionIndex];
      if (answerId) {
        const question = questions[questionIndex];
        const answer = question.answers.find((ans) => ans.answer_id === answerId);
        if (answer && answer.answer_score) {
          score += answer.answer_score;
        }
      }
    }
    setTotalScore(score);
  }, [selectedAnswers, questions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div>
        <div className="resultsBtnArea">
          {showErrorMessage && (
            <div className="error-msg">
              Please ensure you have entered a pupil name and answered all above questions.
            </div>
          )}
          <button type="button" className="btn btn-primary showResultBtn" onClick={handleShowResults}>
            Show Result
          </button>
        </div>

        {showResults && (
          <>
            <div id="print-content">
              <PrintResult
                selectedAnswers={selectedAnswers}
                questions={questions}
                comments={comments}
                teacherName={teacherName}
                pupilName={pupilName}
                date={date}
                totalScore={totalScore}
                setTotalScore={setTotalScore}
                overrideScore={overrideScore}
                setOverrideScore={setOverrideScore}
                overrideComment={overrideComment}
                setOverrideComment={setOverrideComment}
              />
              <div className="buttons-after-summary">
                <button className="printBtn" onClick={handlePrint}>
                  Print
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ShowResult;
