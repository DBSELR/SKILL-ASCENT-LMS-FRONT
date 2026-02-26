import React from 'react';

const AchievementsForm = ({ data, updateData }) => {
    const achievementsList = data?.achievements || [];

    const addAchievement = () => {
        const newAchievements = [...achievementsList, { title: '', description: '' }];
        updateData({ ...data, achievements: newAchievements });
    };

    const updateAchievement = (index, field, value) => {
        const newAchievements = [...achievementsList];
        newAchievements[index][field] = value;
        updateData({ ...data, achievements: newAchievements });
    };

    const removeAchievement = (index) => {
        const newAchievements = [...achievementsList];
        newAchievements.splice(index, 1);
        updateData({ ...data, achievements: newAchievements });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Key Achievements</h2>
            {achievementsList.map((achievement, index) => (
                <div key={index} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeAchievement(index)}>×</button>
                    <div className="grid-1">
                        <div>
                            <label>Achievement Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Employee of the Month"
                                value={achievement.title}
                                onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                rows="2"
                                placeholder="Details..."
                                value={achievement.description}
                                onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={addAchievement}
                className="btn-secondary w-full"
            >
                + Add Achievement
            </button>
        </div>
    );
};

export default AchievementsForm;
