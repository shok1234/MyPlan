import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import "../styles/Profile.css";
import "../styles/Auth.css";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState(0);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch task stats
  const fetchTaskStats = async (userId) => {
    const { data, error } = await supabase
      .from("student_tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log(error);
      return;
    }

    setTotalTasks(data.length);
    setCompletedTasks(
      data.filter((task) => task.done).length
    );
    setUpcomingTasks(
      data.filter((task) => !task.done).length
    );
  };

  // Fetch profile data
  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email);

    await fetchTaskStats(user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log("PROFILE ERROR:", error);
    }

    if (data) {
      setFullName(data.full_name || "");
      setAvatarPreview(data.avatar_url?.trim() || "");
    }

    setLoading(false);
  };

  // Handle image selection
  const handleFileChange = (e) => {
    setErrorMsg("");
    setSuccessMsg("");

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Update profile
  const updateProfile = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let avatarUrl = avatarPreview;

    // Upload avatar if new one selected
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, {
            upsert: true,
          });

      if (uploadError) {
        setErrorMsg(uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      avatarUrl = publicUrlData.publicUrl;
    }

    // Update profile table
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Profile updated successfully");
    await fetchProfile();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        

        <div className="profile-info">
          <div className="avatar-section">
            <img
              src={
                avatarPreview
                  ? `${avatarPreview}?t=${Date.now()}`
                  : "/default-avatar.png"
              }
              alt="avatar"
              className="avatar"
            />

            <label className="upload-btn">
              Change Photo
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="user-info">
            <h2>{fullName || "Your Name"}</h2>
            <p>{email}</p>
          </div>
        </div>

        <div className="stats">
          <div className="stat-box">
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>

          <div className="stat-box">
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>

          <div className="stat-box">
            <h3>{upcomingTasks}</h3>
            <p>Upcoming</p>
          </div>
        </div>
      </div>

      <div className="edit-card">
        <h3>Edit Profile</h3>

        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          value={email}
          disabled
        />

        {errorMsg && (
          <p className="auth-error">{errorMsg}</p>
        )}

        {successMsg && (
          <p className="auth-success">{successMsg}</p>
        )}

        <button onClick={updateProfile}>
          Save Changes
        </button>
      </div>
    </div>
  );
}