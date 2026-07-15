import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/StudentBoard.css";

export default function StudentBoard() {
  const [date, setDate] = useState("");
  const [task, setTask] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [examDate, setExamDate] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [tasks, setTasks] = useState([]);
  const [taskType, setTaskType] = useState("Exam");
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
        exam_date: taskType === "Exam" ? examDate : null,
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
      <h2>Student Planner</h2>
      <p className="page-subtitle">
      Organize your study tasks and track your daily progress.
    </p>

      <div className="progressBox">
      <div className="progressHeader">
        <span>Overall Progress</span>
        <span>{progress}%</span>
      </div>
       <div className="progressBar">
        <div style={{ width: `${progress}%` }}></div>
      </div>
    </div>


      <div className="inputBox">
        <label>Task Deadline</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Task title..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <label>Task Type</label>

<select
  value={taskType}
  onChange={(e) => setTaskType(e.target.value)}>
  <option value="Exam">Exam</option>
  <option value="Quiz">Quiz</option>
  <option value="Assignment">Assignment</option>
  <option value="Project">Project</option>
  <option value="Homework">Homework</option>
  <option value="Presentation">Presentation</option>
</select>

        <input
          type="text"
          placeholder="Subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {taskType === "Exam" && (
  <>
    <label>Exam Date</label>

    <input
      type="date"
      value={examDate}
      onChange={(e) => setExamDate(e.target.value)}
    />
  </>
)}

        <input
          type="number"
          placeholder="Planned Study Hours"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
        />

       <button className="primary-btn" onClick={addTask}>
  Add Task
</button>
      </div>

      <h3 className="section-title active-title">
       Active Plans
      </h3>

      {activeTasks.map((t) => (
        <div key={t.id} className="card">
          <div className="cardContent">
            <div className="task">{t.title}</div>
            <div className="task-type">
            {t.task_type}
            </div>
            <div className="subject">{t.subject}</div>

  {(t.task_type === "Exam" || t.task_type === "Quiz") ? (
  <>
    <div className="card-section">
      <label>Exam Date</label>
      <p>{t.exam_date}</p>
    </div>

    <div className="card-section">
      <label>Days Remaining</label>
      <p>{getDaysLeft(t.exam_date)} days</p>
    </div>
  </>
) : (
  <div className="card-section">
    <label>Deadline</label>
    <p>{t.due_date}</p>
  </div>
)}

<div className="info-row">
  <span className="info-label">Total Study</span>
  <span>{Number(t.study_hours).toFixed(1)} hours</span>
</div>

<div className="info-row">
  <span className="info-label">Daily Target</span>
  <span>
    {(
      Number(t.study_hours) /
      Math.max(getDaysLeft(t.exam_date), 1)
    ).toFixed(1)}{" "}
    hours/day
  </span>
</div>

<div className="info-row">
  <span className="info-label">Today's Study</span>
  <span>
    {Number(t.today_hours || 0).toFixed(1)} hours
  </span>
</div>

            <div className={`priority ${t.priority.toLowerCase()}`}>
              {t.priority}
            </div>
          </div>
<div className="actions">
  <button onClick={() => addStudyTime(t, 1)}>
    Add 1 Hour
  </button>

  <button onClick={() => toggleDone(t.id, t.done)}>
    Complete
  </button>

  <button onClick={() => deleteTask(t.id)}>
    Delete
  </button>
</div>
 
        </div>
      ))}

      <h3 className="section-title completed-title">
      Completed
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