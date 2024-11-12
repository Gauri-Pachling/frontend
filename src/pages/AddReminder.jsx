import React, { useState, useEffect } from "react";
import axios from "axios";

const AddReminder = () => {
    const [title, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [remDate, setReminderTime] = useState("");
    const [user, setUser] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch user data
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userData = JSON.parse(localStorage.getItem("user"));
        if (token && userData) {
            setUser(userData);
        } else {
            alert("User not authenticated");
        }
    }, []);

    // Fetch reminders for authenticated user
    useEffect(() => {
        if (user) {
            setLoading(true);
            axios
                .get(`http://localhost:8080/api/reminders/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                })
                .then((response) => {
                    setLoading(false);
                    setReminders(response.data);
                })
                .catch((error) => {
                    setLoading(false);
                    setError("Error fetching reminders.");
                    console.error("Error fetching reminders:", error);
                });
        }
    }, [user]);

    // Handler for form submission
    const handleReminderSubmit = (e) => {
        e.preventDefault();

        // Ensure all necessary fields are filled
        if (!title || !dueDate || !remDate) {
            alert("Please fill out all reminder details!");
            return;
        }

        const parsedDueDate = new Date(dueDate);
        console.log(parsedDueDate);
        const parsedRemDate = new Date(remDate);
        console.log(parsedRemDate);

        // Validate reminder date
        if (parsedRemDate >= parsedDueDate) {
            alert("Reminder date must be earlier than the due date.");
            return;
        }
        const token = localStorage.getItem("authToken");
        axios
            .post(
                "http://localhost:8080/api/reminders",
                {
                    user: { id: user.id },
                    title,
                    description,
                    dueDate,
                    remDate,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                // Update reminders list with the new reminder
                setReminders([
                    ...reminders,
                    {
                        id: response.data.id, // Ensure each reminder has a unique ID
                        title: response.data.title,
                        description: response.data.description,
                        dueDate: response.data.dueDate,
                        remDate: response.data.remDate,
                    },
                ]);

                // Clear form after successful submission
                setTaskName("");
                setDescription("");
                setDueDate("");
                setReminderTime("");
            })
            .catch((error) => {
                setError("Failed to add reminder.");
                console.error("Error adding reminder:", error);
            });
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Add Reminder</h2>
            <form onSubmit={handleReminderSubmit} style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Task Name:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    required
                    style={{ padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    style={{
                        padding: "8px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        resize: "none",
                        height: "80px",
                    }}
                />

                <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Due Date:</label>
                <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    style={{ padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <label style={{ margin: "10px 0 5px", fontWeight: "bold" }}>Reminder Time:</label>
                <input
                    type="datetime-local"
                    value={remDate}
                    onChange={(e) => setReminderTime(e.target.value)}
                    required
                    style={{ padding: "8px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <button
                    type="submit"
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        fontSize: "16px",
                        color: "#fff",
                        backgroundColor: "#4CAF50",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Save Reminder
                </button>
            </form>

            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <h3>Reminders List</h3>
                {loading ? (
                    <p>Loading reminders...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {reminders.map((reminder) => (
                            <li
                                key={reminder.id}
                                style={{
                                    border: "1px solid #ddd",
                                    marginBottom: "10px",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h4>{reminder.title}</h4>
                                <p>{reminder.description}</p>
                                <p>
                                    <strong>Due:</strong> {new Date(reminder.dueDate).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Reminder:</strong> {new Date(reminder.remDate).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddReminder;
