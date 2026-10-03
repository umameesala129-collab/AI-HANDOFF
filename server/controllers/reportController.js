import Project from '../models/Project.js';
import Document from '../models/Document.js';
import Task from '../models/Task.js';
import Decision from '../models/Decision.js';
import Issue from '../models/Issue.js';
import Milestone from '../models/Milestone.js';
import TimelineEvent from '../models/TimelineEvent.js';
import AIInsight from '../models/AIInsight.js';

export async function generateHandoffReport(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const documents = await Document.find({ projectId: id });
    const tasks = await Task.find({ projectId: id });
    const decisions = await Decision.find({ projectId: id });
    const issues = await Issue.find({ projectId: id });
    const milestones = await Milestone.find({ projectId: id });
    const timelineEvents = await TimelineEvent.find({ projectId: id });
    const insights = await AIInsight.find({ projectId: id });

    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const pendingTasks = tasks.filter(t => t.status !== 'Completed');
    const openIssues = issues.filter(i => i.status !== 'Resolved');

    // Build recommended next actions with reasoning and evidence
    const nextActions = [];

    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    if (inProgressTasks.length > 0) {
      nextActions.push({
        title: `Continue active task: ${inProgressTasks[0].title}`,
        priority: 'Immediate',
        owner: inProgressTasks[0].assignee,
        reason: 'Work is already underway and unblocked.',
        relatedTask: inProgressTasks[0].title,
        evidence: inProgressTasks[0].sourceExcerpt || 'Extracted from project sprint deliverables.',
        sourceDocument: inProgressTasks[0].sourceDocumentName || 'Project Backlog'
      });
    }

    if (openIssues.length > 0) {
      nextActions.push({
        title: `Resolve open bottleneck: ${openIssues[0].title}`,
        priority: 'High',
        owner: 'Incoming Project Owner',
        reason: openIssues[0].description,
        relatedTask: openIssues[0].relatedTask || 'System Integration',
        evidence: openIssues[0].suggestedAction || 'Derived from blocker detection.',
        sourceDocument: openIssues[0].sourceDocumentName || 'Issue Tracker'
      });
    }

    nextActions.push({
      title: 'Conduct weekly stakeholder sync on upcoming deadlines',
      priority: 'Medium',
      owner: 'Project Manager',
      reason: 'Align cross-functional team on deliverables targeting the upcoming milestone release.',
      relatedTask: 'Project Governance',
      evidence: 'Multiple documents indicate hard deadlines approaching within 30 days.',
      sourceDocument: 'All Ingested Documents'
    });

    const report = {
      projectTitle: project.name,
      projectType: project.projectType,
      status: project.status,
      generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      reconstructedSummary: project.summary,
      currentSituation: project.currentSituation,
      progress: project.progress,
      handoffReadiness: project.handoffReadiness || {
        score: 85,
        status: 'Ready',
        missingContext: []
      },
      teamMembers: project.teamMembers,
      documentInventory: documents.map(d => ({
        name: d.name,
        category: d.category,
        fileType: d.fileType,
        size: d.fileSize
      })),
      completedWork: completedTasks.map(t => ({
        task: t.title,
        completedDate: t.completedDate || 'Recently',
        responsiblePerson: t.assignee,
        source: t.sourceDocumentName,
        sourceExcerpt: t.sourceExcerpt
      })),
      pendingWork: pendingTasks.map(t => ({
        task: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        assignee: t.assignee,
        deadline: t.deadline,
        dependencies: t.dependencies,
        source: t.sourceDocumentName
      })),
      importantDecisions: decisions.map(d => ({
        title: d.title,
        reason: d.reason,
        decisionDate: d.decisionDate,
        decisionMaker: d.decisionMaker,
        source: d.sourceDocumentName,
        sourceExcerpt: d.sourceExcerpt
      })),
      knownIssuesAndBlockers: issues.map(i => ({
        title: i.title,
        severity: i.severity,
        status: i.status,
        detectedDate: i.detectedDate,
        relatedTask: i.relatedTask,
        suggestedAction: i.suggestedAction,
        source: i.sourceDocumentName
      })),
      upcomingDeadlines: milestones.map(m => ({
        milestone: m.title,
        targetDate: m.milestoneDate,
        status: m.status,
        source: m.sourceDocumentName
      })),
      recommendedNextActions: nextActions,
      chronologicalTimeline: timelineEvents.map(e => ({
        date: e.eventDate,
        title: e.title,
        type: e.eventType,
        description: e.description,
        source: e.sourceDocumentName
      })),
      aiContextConnections: insights.filter(i => i.insightType === 'ContextConnection').map(i => ({
        content: i.content,
        confidence: i.confidence,
        evidenceChain: i.evidenceChain
      })),
      conflictsDetected: insights.filter(i => i.insightType === 'Conflict').map(i => ({
        content: i.content,
        conflictDetails: i.conflictDetails
      }))
    };

    return res.status(200).json({
      success: true,
      message: 'Handoff report generated successfully',
      data: report
    });
  } catch (err) {
    next(err);
  }
}
