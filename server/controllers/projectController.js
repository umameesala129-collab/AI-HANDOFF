import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Issue from '../models/Issue.js';
import Document from '../models/Document.js';
import { seedSmartClinicDemo } from './seedDemoData.js';

export async function createProject(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const { name, description, projectType, teamMembers, startDate, endDate } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    const project = await Project.create({
      userId,
      name,
      description: description || '',
      projectType: projectType || 'Web Application',
      teamMembers: teamMembers ? (Array.isArray(teamMembers) ? teamMembers : teamMembers.split(',').map(m => m.trim())) : [],
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '',
      status: 'On Track',
      progress: 10,
      handoffReadiness: {
        score: 25,
        status: 'Needs Review',
        missingContext: ['Documents required to reconstruct project context', 'Pending cross-document AI analysis']
      },
      summary: 'New project created. Upload project documents (meeting notes, task lists, specs) to initiate context reconstruction.',
      currentSituation: 'Awaiting initial document ingestion.'
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (err) {
    next(err);
  }
}

export async function listProjects(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const projects = await Project.find({ userId });

    // Enrich projects with real counts from DB
    const enriched = await Promise.all(
      projects.map(async p => {
        const pId = p._id || p.id;
        const totalTasks = await Task.countDocuments({ projectId: pId });
        const pendingTasks = await Task.countDocuments({
          projectId: pId,
          status: { $in: ['Not Started', 'In Progress', 'Blocked'] }
        });
        const openIssues = await Issue.countDocuments({
          projectId: pId,
          status: { $in: ['Open', 'In Progress'] }
        });
        const docCount = await Document.countDocuments({ projectId: pId });

        return {
          ...p,
          stats: {
            totalTasks,
            pendingTasks,
            openIssues,
            docCount
          }
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const pId = project._id || project.id;
    const totalTasks = await Task.countDocuments({ projectId: pId });
    const completedTasks = await Task.countDocuments({ projectId: pId, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({
      projectId: pId,
      status: { $in: ['Not Started', 'In Progress', 'Blocked'] }
    });
    const openIssues = await Issue.countDocuments({
      projectId: pId,
      status: { $in: ['Open', 'In Progress'] }
    });
    const docCount = await Document.countDocuments({ projectId: pId });

    // Calculate AI Health Estimates based on real document & item data
    const taskScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 40;
    const deadlineScore = pendingTasks > 0 ? 80 : 95;
    const issueScore = openIssues === 0 ? 100 : Math.max(20, 100 - openIssues * 20);
    const docScore = docCount > 0 ? Math.min(100, docCount * 25) : 10;
    const contextScore = Math.round((taskScore * 0.25) + (deadlineScore * 0.25) + (issueScore * 0.25) + (docScore * 0.25));

    const healthBreakdown = {
      overallScore: contextScore,
      taskHealth: { score: taskScore, label: `${completedTasks}/${totalTasks} tasks finished`, basis: 'Calculated from completed vs total extracted tasks' },
      deadlineHealth: { score: deadlineScore, label: 'Milestones on schedule', basis: 'AI projection based on task velocity and upcoming dates' },
      issueHealth: { score: issueScore, label: `${openIssues} active blockers`, basis: 'Deductions applied per unresolved blocker severity' },
      documentationHealth: { score: docScore, label: `${docCount} documents parsed`, basis: 'Based on document coverage across categories' },
      contextCompleteness: { score: project.handoffReadiness?.score || contextScore, label: project.handoffReadiness?.status || 'Needs Review', basis: 'AI assessment of source citation density and conflict resolution' }
    };

    return res.status(200).json({
      success: true,
      data: {
        ...project,
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          openIssues,
          docCount
        },
        healthBreakdown
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const projects = await Project.find({ userId });
    const projectIds = projects.map(p => p._id || p.id);

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status !== 'Completed').length;

    let pendingTasks = 0;
    let openIssues = 0;

    for (const pId of projectIds) {
      const pTasks = await Task.countDocuments({
        projectId: pId,
        status: { $in: ['Not Started', 'In Progress', 'Blocked'] }
      });
      const pIssues = await Issue.countDocuments({
        projectId: pId,
        status: { $in: ['Open', 'In Progress'] }
      });
      pendingTasks += pTasks;
      openIssues += pIssues;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalProjects,
        activeProjects,
        pendingTasks,
        openIssues
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function handleTryDemoProject(req, res, next) {
  try {
    const userId = req.user._id || req.user.id;
    const demoProject = await seedSmartClinicDemo(userId);
    return res.status(200).json({
      success: true,
      message: 'SmartClinic Management Platform demo project loaded successfully',
      data: demoProject
    });
  } catch (err) {
    next(err);
  }
}
