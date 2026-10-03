import Task from '../models/Task.js';
import Project from '../models/Project.js';

export async function listTasks(req, res, next) {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ projectId: id });
    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Not Started', 'In Progress', 'Blocked', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task status'
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updated = await Task.findByIdAndUpdate(id, {
      status,
      completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : task.completedDate
    });

    // Update project progress
    const allTasks = await Task.find({ projectId: task.projectId });
    const completed = allTasks.filter(t => (t._id || t.id) === id ? status === 'Completed' : t.status === 'Completed').length;
    const progress = Math.round((completed / Math.max(1, allTasks.length)) * 100);
    await Project.findByIdAndUpdate(task.projectId, { progress });

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, priority, assignee, deadline, dependencies } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = await Task.create({
      projectId: id,
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: 'Not Started',
      assignee: assignee || 'Unassigned',
      deadline: deadline || '',
      dependencies: dependencies ? (Array.isArray(dependencies) ? dependencies : [dependencies]) : []
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
}
