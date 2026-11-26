import { useState } from "react";

function AddOperator() {
  const [formData, setFormData] = useState({
    operatorId: "",
    operatorName: "",
    phoneNumber: "",
    assignedMachine: "",
    shift: "Morning",
    joiningDate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/operators",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Operator added successfully!");

        setFormData({
          operatorId: "",
          operatorName: "",
          phoneNumber: "",
          assignedMachine: "",
          shift: "Morning",
          joiningDate: ""
        });
      } else {
        alert(data.error || data.message || "Failed to add operator");
      }

    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Add Operator</h1>
          <p>Add a new powerloom operator</p>
        </div>
      </div>

      <div className="content-card">

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Operator ID</label>

              <input
                type="text"
                name="operatorId"
                placeholder="Example: OP-06"
                value={formData.operatorId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Operator Name</label>

              <input
                type="text"
                name="operatorName"
                placeholder="Enter operator name"
                value={formData.operatorName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Assigned Machine</label>

              <input
                type="text"
                name="assignedMachine"
                placeholder="Example: M-06"
                value={formData.assignedMachine}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Shift</label>

              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="form-group">
              <label>Joining Date</label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Save Operator
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddOperator;