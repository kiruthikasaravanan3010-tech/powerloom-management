import { useEffect, useState } from "react";

import {
  Building2,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
  Factory,
  Package,
  Save,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Phone,
  UserRound,
  Image,
  LockKeyhole,
  LogOut,
  Clock,
  CalendarDays,
  Languages,
  Boxes,
  ClipboardList,
  CreditCard,
  ChevronDown
} from "lucide-react";

const DEFAULT_SETTINGS = {
  factoryName: "Kiruthika Textiles",
  factoryLocation: "Pallipalayam",
  factoryLogo: "/images/kt-logo.png",
  contactNumber: "",
  emailAddress: "",
  ownerName: "",

  newOrderAlerts: true,
  productionEntryAlerts: true,
  maintenanceAlerts: true,
  lowStockAlerts: true,
  pendingPaymentAlerts: true,

  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-hour",
  defaultDashboard: "dashboard",
  language: "English",

  userRole: "Owner",
  loginSecurity: true,

  defaultShift: "Morning",
  productionUnit: "Pieces",
  machineNamingFormat: "Machine 01",
  defaultClothType: "Cotton",

  lowStockLimit: 100,
  orderStatusPreference: "Pending",
  paymentReminder: true,
  stockUnit: "Pieces"
};

const SETTINGS_SECTIONS = [
  {
    id: "factory",
    label: "Factory Settings",
    description: "Factory information and contact details",
    icon: Building2
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts and reminders",
    icon: Bell
  },
  {
    id: "system",
    label: "System Preferences",
    description: "Application display preferences",
    icon: SettingsIcon
  },
  {
    id: "security",
    label: "User & Security",
    description: "Account access and security",
    icon: ShieldCheck
  },
  {
    id: "production",
    label: "Production Settings",
    description: "Production and machine defaults",
    icon: Factory
  },
  {
    id: "stock",
    label: "Stock & Orders",
    description: "Inventory and order preferences",
    icon: Package
  }
];

function Settings({ onLogout }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeSection, setActiveSection] = useState("factory");
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleChangePassword = async (event) => {
  event.preventDefault();

  setMessage("");
  setSaved(false);

  if (!currentPassword || !newPassword || !confirmPassword) {
    setMessage("Please fill in all password fields.");
    return;
  }

  if (newPassword.length < 8) {
    setMessage("New password must be at least 8 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setMessage("New passwords do not match.");
    return;
  }

  if (currentPassword === newPassword) {
    setMessage("New password must be different from the current password.");
    return;
  }

  const token = sessionStorage.getItem("token");

  if (!token) {
    setMessage("Session expired. Please log in again.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Unable to change password.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);

    setMessage("Password changed successfully. Please log in again.");

    // End the current frontend session after changing the password.
    if (onLogout) {
      onLogout();
    }
  } catch (error) {
    setMessage("Unable to connect to the server. Please try again.");
  }
};

  useEffect(() => {
    try {
      const stored = localStorage.getItem("powerloomSettings");

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored)
        });
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }
  }, []);

  const updateSetting = (name, value) => {
    setSettings((previous) => ({
      ...previous,
      [name]: value
    }));

    setSaved(false);
    setMessage("");
  };

  const saveSettings = () => {
  try {
    localStorage.setItem(
      "powerloomSettings",
      JSON.stringify(settings)
    );

    // Notify other components that settings have changed
    window.dispatchEvent(
      new Event("powerloomSettingsUpdated")
    );

    setSaved(true);
    setMessage("Settings saved successfully.");
  } catch (error) {
    console.error("Unable to save settings:", error);
    setSaved(false);
    setMessage("Unable to save settings. Please try again.");
  }
};

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Reset all settings to their default values?"
    );

    if (!confirmed) return;

    setSettings({ ...DEFAULT_SETTINGS });

    localStorage.removeItem("powerloomSettings");

    setSaved(false);
    setMessage("Settings have been reset.");
  };

  const renderInput = (
    label,
    name,
    placeholder = "",
    icon = null,
    type = "text"
  ) => (
    <div className="settings-field" key={name}>
      <label htmlFor={name}>{label}</label>

      <div className="settings-input-wrap">
        {icon && (
          <span className="settings-input-icon">
            {icon}
          </span>
        )}

        <input
          id={name}
          type={type}
          value={settings[name]}
          placeholder={placeholder}
          onChange={(event) =>
            updateSetting(name, event.target.value)
          }
        />
      </div>
    </div>
  );

  const renderSelect = (
    label,
    name,
    options,
    icon = null
  ) => (
    <div className="settings-field" key={name}>
      <label htmlFor={name}>{label}</label>

      <div className="settings-select-wrap">
        {icon && (
          <span className="settings-input-icon">
            {icon}
          </span>
        )}

        <select
          id={name}
          value={settings[name]}
          onChange={(event) =>
            updateSetting(name, event.target.value)
          }
        >
          {options.map((option) => (
            <option
              value={option.value}
              key={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="settings-select-arrow"
        />
      </div>
    </div>
  );

  const renderToggle = (
    title,
    description,
    name
  ) => (
    <div className="settings-toggle-row" key={name}>
      <div className="settings-toggle-text">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <label className="settings-switch">
        <input
          type="checkbox"
          checked={Boolean(settings[name])}
          onChange={(event) =>
            updateSetting(name, event.target.checked)
          }
          aria-label={title}
        />

        <span className="settings-slider" />
      </label>
    </div>
  );

  const activeItem = SETTINGS_SECTIONS.find(
    (item) => item.id === activeSection
  );

  return (
    <div className="page settings-page">

      {/* PAGE HEADER */}

      <div className="page-header settings-page-header">
        <div>
          <h1>Settings</h1>

          <p>
            Configure your factory operations and application
            preferences.
          </p>
        </div>

        <div className="settings-status">
          <span className="settings-status-dot" />
          Configuration
        </div>
      </div>

      {/* SETTINGS LAYOUT */}

      <div className="settings-layout">

        {/* SETTINGS NAVIGATION */}

        <aside className="settings-nav">
          <div className="settings-nav-heading">
            <span>GENERAL</span>
          </div>

          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;

            return (
              <button
                type="button"
                key={section.id}
                className={`settings-nav-item ${
                  activeSection === section.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveSection(section.id);
                  setMessage("");
                }}
              >
                <Icon size={19} />

                <span className="settings-nav-label">
                  <strong>{section.label}</strong>
                  <small>{section.description}</small>
                </span>
              </button>
            );
          })}
        </aside>

        {/* SETTINGS CONTENT */}

        <main className="settings-content">

          <div className="settings-content-header">
            <div>
              <span className="settings-eyebrow">
                CONFIGURATION
              </span>

              <h2>{activeItem?.label}</h2>

              <p>{activeItem?.description}</p>
            </div>

            {activeItem && (
              <div className="settings-content-icon">
                <activeItem.icon size={23} />
              </div>
            )}
          </div>

          {/* 1. FACTORY SETTINGS */}

          {activeSection === "factory" && (
            <>
              <div className="settings-subsection">
                <h3>Factory Information</h3>
                <p>
                  Update your business identity and contact details.
                </p>
              </div>

              <div className="settings-form-grid">
                {renderInput(
                  "Factory Name",
                  "factoryName",
                  "Enter factory name",
                  <Building2 size={17} />
                )}

                {renderInput(
                  "Factory Location",
                  "factoryLocation",
                  "Enter factory location",
                  <MapPin size={17} />
                )}

                {renderInput(
  "Contact Number",
  "contactNumber",
  "Enter contact number",
  <Phone size={17} />,
  "tel"
)}

{renderInput(
  "Email Address",
  "emailAddress",
  "Enter factory email address",
  <Building2 size={17} />,
  "email"
)}

{renderInput(
  "Owner Name",
  "ownerName",
  "Enter owner name",
  <UserRound size={17} />
)}
              </div>

              <div className="settings-logo-section">
                <div className="settings-logo-preview">
                  <img
                    src={settings.factoryLogo}
                    alt="Factory logo"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="settings-logo-info">
                  <strong>Factory Logo</strong>
                  <p>
                    Current logo path: {settings.factoryLogo}
                  </p>
                  <small>
                    The logo path can be changed here. The file
                    must already exist in your public folder.
                  </small>
                </div>

                <button
                  type="button"
                  className="settings-secondary-btn"
                  onClick={() => {
                    const path = window.prompt(
                      "Enter the factory logo path:",
                      settings.factoryLogo
                    );

                    if (path !== null && path.trim()) {
                      updateSetting(
                        "factoryLogo",
                        path.trim()
                      );
                    }
                  }}
                >
                  <Image size={16} />
                  Change Path
                </button>
              </div>
            </>
          )}

          {/* 2. NOTIFICATIONS */}

          {activeSection === "notifications" && (
            <>
              <div className="settings-subsection">
                <h3>Alert Preferences</h3>
                <p>
                  Enable or disable the notification preferences
                  you want to use.
                </p>
              </div>

              <div className="settings-toggle-list">
                {renderToggle(
                  "New Order Alerts",
                  "Alerts for newly created customer orders.",
                  "newOrderAlerts"
                )}

                {renderToggle(
                  "Production Entry Alerts",
                  "Alerts when production records are added.",
                  "productionEntryAlerts"
                )}

                {renderToggle(
                  "Machine Maintenance Alerts",
                  "Reminders for machine maintenance activities.",
                  "maintenanceAlerts"
                )}

                {renderToggle(
                  "Low Stock Alerts",
                  "Alerts when stock reaches the configured limit.",
                  "lowStockAlerts"
                )}

                {renderToggle(
                  "Pending Payment Alerts",
                  "Reminders for outstanding customer payments.",
                  "pendingPaymentAlerts"
                )}
              </div>

              <div className="settings-info-note">
                <Bell size={18} />
                <p>
                  These options store your preferences. Actual
                  alerts must be connected to the relevant
                  application features separately.
                </p>
              </div>
            </>
          )}

          {/* 3. SYSTEM PREFERENCES */}

          {activeSection === "system" && (
            <>
              <div className="settings-subsection">
                <h3>Display Preferences</h3>
                <p>
                  Choose how information should be presented.
                </p>
              </div>

              <div className="settings-form-grid">
                {renderSelect(
                  "Date Format",
                  "dateFormat",
                  [
                    {
                      value: "DD/MM/YYYY",
                      label: "DD/MM/YYYY"
                    },
                    {
                      value: "MM/DD/YYYY",
                      label: "MM/DD/YYYY"
                    },
                    {
                      value: "YYYY-MM-DD",
                      label: "YYYY-MM-DD"
                    }
                  ],
                  <CalendarDays size={17} />
                )}

                {renderSelect(
                  "Time Format",
                  "timeFormat",
                  [
                    {
                      value: "12-hour",
                      label: "12-hour (02:30 PM)"
                    },
                    {
                      value: "24-hour",
                      label: "24-hour (14:30)"
                    }
                  ],
                  <Clock size={17} />
                )}

                {renderSelect(
                  "Default Dashboard",
                  "defaultDashboard",
                  [
                    {
                      value: "dashboard",
                      label: "Main Dashboard"
                    },
                    {
                      value: "daily-production",
                      label: "Daily Production"
                    },
                    {
                      value: "machines",
                      label: "Machines"
                    },
                    {
                      value: "reports",
                      label: "Reports"
                    }
                  ],
                  <SettingsIcon size={17} />
                )}

                {renderSelect(
                  "Language",
                  "language",
                  [
                    {
                      value: "English",
                      label: "English"
                    },
                    {
                      value: "Tamil",
                      label: "Tamil"
                    }
                  ],
                  <Languages size={17} />
                )}
              </div>

              <div className="settings-info-note">
                <SettingsIcon size={18} />
                <p>
                  These preferences are saved, but applying them
                  throughout the application requires connecting
                  them to the relevant pages.
                </p>
              </div>
            </>
          )}

          {/* 4. USER AND SECURITY */}

          {activeSection === "security" && (
            <>
              <div className="settings-subsection">
                <h3>Account Preferences</h3>
                <p>
                  Configure the account role and security preferences.
                </p>
              </div>

              <div className="settings-form-grid">
                {renderSelect(
                  "User Role",
                  "userRole",
                  [
                    {
                      value: "Owner",
                      label: "Owner"
                    },
                    {
                      value: "Supervisor",
                      label: "Supervisor"
                    },
                    {
                      value: "Operator",
                      label: "Operator"
                    }
                  ],
                  <UserRound size={17} />
                )}
              </div>

              <div className="settings-toggle-list settings-security-list">
                {renderToggle(
                  "Login Security",
                  "Enable the login security preference.",
                  "loginSecurity"
                )}
              </div>

              <div className="settings-security-actions">
                <div className="settings-security-description">
                  <div className="settings-security-icon">
                    <LockKeyhole size={20} />
                  </div>

                  <div>
                    <strong>Password Management</strong>
                    <p>
                      Password changes require a connected
                      authentication feature.
                    </p>
                  </div>
                </div>

                <button
  type="button"
  className="settings-secondary-btn"
  onClick={() => setShowPasswordForm(true)}
>
                  <LockKeyhole size={16} />
                  Change Password
                </button>
              </div>

              <div className="settings-security-actions">
                <div className="settings-security-description">
                  <div className="settings-security-icon">
                    <LogOut size={20} />
                  </div>

                  {showPasswordForm && (
  <form
    onSubmit={handleChangePassword}
    style={{
      marginTop: "16px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    }}
  >
    <h3>Change Password</h3>

    <div>
      <label htmlFor="currentPassword">Current Password</label>
      <input
        id="currentPassword"
        type="password"
        value={currentPassword}
        onChange={(event) =>
          setCurrentPassword(event.target.value)
        }
        autoComplete="current-password"
        required
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div>
      <label htmlFor="newPassword">New Password</label>
      <input
        id="newPassword"
        type="password"
        value={newPassword}
        onChange={(event) =>
          setNewPassword(event.target.value)
        }
        autoComplete="new-password"
        minLength={8}
        required
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div>
      <label htmlFor="confirmPassword">
        Confirm New Password
      </label>
      <input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(event.target.value)
        }
        autoComplete="new-password"
        minLength={8}
        required
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button type="submit" className="settings-secondary-btn">
        Update Password
      </button>

      <button
        type="button"
        className="settings-secondary-btn"
        onClick={() => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowPasswordForm(false);
          setMessage("");
        }}
      >
        Cancel
      </button>
    </div>
  </form>
)}

                  <div>
                    <strong>Logout</strong>
                    <p>
                      Exit your current application session.
                    </p>
                  </div>
                </div>

                <button
  type="button"
  className="settings-secondary-btn"
  onClick={onLogout}
>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>

              <div className="settings-info-note">
                <ShieldCheck size={18} />
                <p>
                  User roles and login security are currently
                  stored as preferences. They do not enforce
                  access permissions or authentication.
                </p>
              </div>
            </>
          )}

          {/* 5. PRODUCTION SETTINGS */}

{activeSection === "production" && (
  <>
    <div className="settings-subsection">
      <h3>Production Preferences</h3>
      <p>
        Configure default values for daily machine production entries.
      </p>
    </div>

    <div className="settings-form-grid">

      {renderSelect(
        "Default Shift",
        "defaultShift",
        [
          { value: "Morning", label: "Morning" },
          { value: "Night", label: "Night" }
        ],
        <Clock size={17} />
      )}

      {renderSelect(
        "Production Unit",
        "productionUnit",
        [
          { value: "Pieces", label: "Pieces" },
          { value: "Metres", label: "Metres" }
        ],
        <Boxes size={17} />
      )}

      {renderSelect(
        "Machine Naming Format",
        "machineNamingFormat",
        [
          { value: "Machine 01", label: "Machine 01" },
          { value: "M-01", label: "M-01" },
          { value: "Loom-01", label: "Loom-01" }
        ],
        <Factory size={17} />
      )}

      {renderSelect(
  "Default Cloth Type",
  "defaultClothType",
  [
    { value: "Vesti", label: "Vesti" },
    { value: "Lungi", label: "Lungi" },
    { value: "Jari Vesti", label: "Jari Vesti" },
    { value: "Printed Vesti", label: "Printed Vesti" },
    { value: "kerala saree", label: "Kerala Saree" },
    { value: "Other", label: "Other" }
  ],
  <Boxes size={17} />
)}

    </div>

    <div className="settings-info-note">
      <Factory size={18} />

      <p>
        These options define your preferred production defaults.
        Changes will be applied to the Add Production form after
        connecting these settings to that page.
      </p>
    </div>
  </>
)}

          {/* 6. STOCK AND ORDERS */}

          {activeSection === "stock" && (
            <>
              <div className="settings-subsection">
                <h3>Inventory Preferences</h3>
                <p>
                  Set stock warning and order handling preferences.
                </p>
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label htmlFor="lowStockLimit">
                    Low Stock Warning Limit
                  </label>

                  <div className="settings-input-wrap">
                    <span className="settings-input-icon">
                      <Boxes size={17} />
                    </span>

                    <input
                      id="lowStockLimit"
                      type="number"
                      min="0"
                      value={settings.lowStockLimit}
                      onChange={(event) => {
                        const value = event.target.value;

                        updateSetting(
                          "lowStockLimit",
                          value === ""
                            ? ""
                            : Math.max(0, Number(value))
                        );
                      }}
                    />
                  </div>

                  <small>
                    Alert threshold for available stock.
                  </small>
                </div>

                {renderSelect(
                  "Default Order Status",
                  "orderStatusPreference",
                  [
                    {
                      value: "Pending",
                      label: "Pending"
                    },
                    {
                      value: "In Progress",
                      label: "In Progress"
                    },
                    {
                      value: "Completed",
                      label: "Completed"
                    }
                  ],
                  <ClipboardList size={17} />
                )}

                {renderSelect(
                  "Stock Unit",
                  "stockUnit",
                  [
                    {
                      value: "Pieces",
                      label: "Pieces"
                    },
                    {
                      value: "Metres",
                      label: "Metres"
                    },
                    {
                      value: "Rolls",
                      label: "Rolls"
                    }
                  ],
                  <Package size={17} />
                )}
              </div>

              <div className="settings-toggle-list settings-payment-list">
                {renderToggle(
                  "Payment Reminders",
                  "Enable the preference for pending payment reminders.",
                  "paymentReminder"
                )}
              </div>

              <div className="settings-info-note">
                <CreditCard size={18} />
                <p>
                  The stock warning, order status, and payment
                  preferences must be connected to the inventory
                  and order modules to affect their behaviour.
                </p>
              </div>
            </>
          )}

          {/* ACTIONS */}

          <div className="settings-footer">
            <button
              type="button"
              className="settings-reset-btn"
              onClick={resetSettings}
            >
              <RotateCcw size={16} />
              Reset Defaults
            </button>

            <button
              type="button"
              className="settings-save-btn"
              onClick={saveSettings}
            >
              {saved ? (
                <CheckCircle2 size={17} />
              ) : (
                <Save size={17} />
              )}

              {saved ? "Saved" : "Save Changes"}
            </button>
          </div>

          {message && (
            <div
              className={`settings-message ${
                saved ? "success" : ""
              }`}
              role="status"
            >
              {saved ? (
                <CheckCircle2 size={17} />
              ) : null}

              <span>{message}</span>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Settings;