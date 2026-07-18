import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/StudentBoard.css";
import { useTranslation } from "react-i18next";
export default function StudentBoard() {
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [examDate, setExamDate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskType, setTaskType] = useState("Exam");
  const { t } = useTranslation();
  useEffect(() => {
  fetchTasks();
}, []);
  const fetchTasks = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("student_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setTasks(data || []);
  };

  const addTask = async () => {
   if (
  !date ||
  !task ||
  !subject ||
  !studyHours ||
  (taskType === "Exam" && !examDate)
)
  return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

     const { data, error } = await supabase
    .from("student_tasks")
    .insert([
      {
        user_id: user.id,
        title: task,
        task_type: taskType,
        subject,
        priority,
        due_date: date,
        exam_date: examDate,
        study_hours: Number(studyHours),
        status: "pending",
      },
    ])
    .select();
     console.log("DATA:", data);
     console.log("ERROR:", error);

    if (error) {
    console.error(error);
    alert(error.message);
    return;
    }

    setTasks([data[0], ...tasks]);

    setDate("");
    setTask("");
    setSubject("");
    setPriority("Medium");
    setTaskType("Exam");
    setExamDate("");
    setStudyHours("");
 };

  const toggleDone = async (id, currentStatus) => {
    await supabase
      .from("student_tasks")
      .update({
        done: !currentStatus,
      })
      .eq("id", id);

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("student_tasks").delete().eq("id", id);
    fetchTasks();
  };
  const addStudyTime = async (task, hours) => {
  const today = new Date().toISOString().split("T")[0];

  let todayHours = Number(task.today_hours || 0);

  // reset automatically every new day
  if (task.last_study_date !== today) {
    todayHours = 0;
  }

  await supabase
    .from("student_tasks")
    .update({
      today_hours: todayHours + hours,
      last_study_date: today,
    })
    .eq("id", task.id);

  fetchTasks();
};


  const activeTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  const progress =
    tasks.length > 0
      ? Math.round((doneTasks.length / tasks.length) * 100)
      : 0;

  const getDaysLeft = (examDate) => {
  if (!examDate) return "-";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const exam = new Date(examDate);
  exam.setHours(0, 0, 0, 0);

  const diff = exam.getTime() - today.getTime();

  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

  return (
    <div className="student-board">
      <h2>{t("studentPlanner")}</h2>
      <p className="page-subtitle">
      {t("subtitle")}
    </p>

      <div className="progressBox">
      <div className="progressHeader">
        <span>{t("overallProgress")}</span>
        <span>{progress}%</span>
      </div>
       <div className="progressBar">
        <div style={{ width: `${progress}%` }}></div>
      </div>
    </div>


     <div className="inputBox">
        <label>{t("taskDeadline")}</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder={t("taskTitle")}
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <label>{t("taskType")}</label>

    <select
      value={taskType}
      onChange={(e) => setTaskType(e.target.value)}>
      <option value="Exam">{t("exam")}</option>
      <option value="Quiz">{t("quiz")}</option>
      <option value="Assignment">{t("assignment")}</option>
      <option value="Project">{t("project")}</option>
      <option value="Homework">{t("homework")}</option>
      <option value="Presentation">{t("presentation")}</option>
    </select>

        <input
          type="text"
          placeholder={t("subject")}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>{t("high")}</option>
          <option>{t("medium")}</option>
          <option>{t("low")}</option>
        </select>

        {(taskType === "Exam" || taskType === "Quiz") && (
  <>
    <label>
  {taskType === "Quiz" ? t("quizDate") : t("examDate")}
</label>

    <input
      type="date"
      value={examDate}
      onChange={(e) => setExamDate(e.target.value)}
    />
  </>
)}

        <input
          type="number"
          placeholder={t("plannedStudyHours")}
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
        />

       <button className="primary-btn" onClick={addTask}>
  {t("addTask")}
</button>
      </div>

      <h3 className="section-title active-title">
       {t("activePlans")}
      </h3>

      {activeTasks.map((task) => {
  const daysLeft = getDaysLeft(task.exam_date);

  const dailyGoal =
    task.exam_date
      ? (
          Number(task.study_hours) /
          Math.max(daysLeft, 1)
        ).toFixed(1)
      : "-";
      const studyLimitReached =
  Number(task.today_hours) >= Number(task.study_hours);

  const studyProgress =
    Number(task.study_hours) > 0
      ? Math.min(
          100,
          (Number(task.today_hours || 0) /
            Number(task.study_hours)) * 100
        )
      : 0;

  return (
    <div key={task.id} className="task-card">

      <div className="task-header">
        <div>
          <h3>{task.title}</h3>
          <p>
           {t(task.task_type.toLowerCase())} • {task.subject}
          </p>
        </div>

        <span className={`priority ${task.priority.toLowerCase()}`}>
          {t(task.priority.toLowerCase())}
        </span>
      </div>

      <div className="task-grid">

        {task.task_type === "Exam" ||
        task.task_type === "Quiz" ? (
          <>
            <div>
  <label>
    {task.task_type === "Quiz" ?  t("quizDate") : t("examDate")}
  </label>
  <span>{task.exam_date}</span>
</div>

        <div>
  <label>{t("remaining")}</label>
  <span>
    {!task.exam_date
      ? "-"
      : daysLeft === 0
      ? t("today")
      : `${daysLeft} ${t("days")}`
      }
  </span>
</div>
          </>
        ) : (
          <div>
            <label>Deadline</label>
            <span>{task.due_date}</span>
          </div>
        )}

        <div>
          <label>{t("plannedStudy")}</label>
          <span>{Number(task.study_hours).toFixed(1)} h</span>
        </div>

        <div>
          <label>{t("dailyGoal")}</label>
          <span>{dailyGoal} h/day</span>
        </div>

        <div>
          <label>{t("todayStudy")}</label>
          <span>{Number(task.today_hours || 0).toFixed(1)} h</span>
        </div>

      </div>

      <div className="study-progress">

  <div className="study-progress-bar">
    <div
      className="study-progress-fill"
      style={{ width: `${studyProgress}%` }}
    ></div>
  </div>

</div>
      <div className="study-status">
  {Number(task.today_hours || 0) < Number(task.study_hours) ? (
    <span>
      {(Number(task.study_hours) - Number(task.today_hours || 0)).toFixed(1)} {t("hoursRemaining")}
    </span>
  ) : Number(task.today_hours || 0) === Number(task.study_hours) ? (
    <span className="goal-reached">
     {t("dailyGoalReached")}
    </span>
  ) : (
    <div className="overstudy-warning">
    {t("exceededGoal")}{" "}
    {(Number(task.today_hours) - Number(task.study_hours)).toFixed(1)} h
  </div>
  )}
</div>

      <div className="task-actions">
       <button
  disabled={studyLimitReached}
  onClick={() => addStudyTime(task, 1)}
>
  {studyLimitReached ? t("goalReached") : t("study")}
</button>

        <button
          onClick={() =>
            toggleDone(task.id, task.done)
          }
        >
          {t("complete")}
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteTask(task.id)}
        >
          {t("delete")}
        </button>
      </div>

    </div>
  );
})}

      <h3 className="section-title completed-title">
      {t("completed")}
      </h3>

      {doneTasks.map((t) => (
        <div key={t.id} className="card done">
          <div>
            <div className="task strike">{t.title}</div>
            <div className="subject">{t.subject}</div>
          </div>

          <div className="actions">
            <button onClick={() => toggleDone(t.id, t.done)}>↩</button>
            <button onClick={() => deleteTask(t.id)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}