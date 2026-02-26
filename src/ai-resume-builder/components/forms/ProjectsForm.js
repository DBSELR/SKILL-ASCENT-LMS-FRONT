import React from 'react';

const ProjectsForm = ({ data, updateData }) => {
    const projectsList = data?.projects || [];

    const addProject = () => {
        const newProjects = [...projectsList, { name: '', description: '', link: '' }];
        updateData({ ...data, projects: newProjects });
    };

    const updateProject = (index, field, value) => {
        const newProjects = [...projectsList];
        newProjects[index][field] = value;
        updateData({ ...data, projects: newProjects });
    };

    const removeProject = (index) => {
        const newProjects = [...projectsList];
        newProjects.splice(index, 1);
        updateData({ ...data, projects: newProjects });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Projects</h2>
            {projectsList.map((project, index) => (
                <div key={index} className="list-item-card">
                    <button className="remove-btn" onClick={() => removeProject(index)}>×</button>
                    <div className="grid-2">
                        <div>
                            <label>Project Name</label>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => updateProject(index, 'name', e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Project Link</label>
                            <input
                                type="text"
                                placeholder="https://"
                                value={project.link}
                                onChange={(e) => updateProject(index, 'link', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            rows="3"
                            value={project.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={addProject}
                className="btn-secondary w-full"
            >
                + Add Project
            </button>
        </div>
    );
};

export default ProjectsForm;
