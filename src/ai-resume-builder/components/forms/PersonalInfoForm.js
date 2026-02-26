import React from "react";

export default function PersonalInfoForm({ data, updateData }) {

    const update = (e) => {
        const updated = {
            ...data,
            personal: { ...(data.personal || {}), [e.target.name]: e.target.value }
        };
        updateData(updated);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Information</h2>
            <div className="grid-2">
                <div>
                    <label>Full Name</label>
                    <input
                        name="fullName"
                        placeholder="e.g. John Doe"
                        value={data.personal?.fullName || ""}
                        onChange={update}
                    />
                </div>
                <div>
                    <label>Email Address</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="e.g. john@example.com"
                        value={data.personal?.email || ""}
                        onChange={update}
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                        name="phone"
                        placeholder="e.g. (555) 123-4567"
                        value={data.personal?.phone || ""}
                        onChange={update}
                    />
                </div>
                <div>
                    <label>LinkedIn / Portfolio URL</label>
                    <input
                        name="linkedin"
                        placeholder="e.g. linkedin.com/in/johndoe"
                        value={data.personal?.linkedin || ""}
                        onChange={update}
                    />
                </div>
            </div>
            <div>
                <label>Professional Summary</label>
                <textarea
                    name="summary"
                    rows="5"
                    placeholder="Briefly describe your professional background and goals..."
                    value={data.personal?.summary || ""}
                    onChange={update}
                />
            </div>
        </div>
    );
}
