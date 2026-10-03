import Issue from '../models/Issue.js';

export async function listIssues(req, res, next) {
  try {
    const { id } = req.params;
    const issues = await Issue.find({ projectId: id });
    return res.status(200).json({
      success: true,
      data: issues
    });
  } catch (err) {
    next(err);
  }
}

export async function updateIssueStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Open', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue status'
      });
    }

    const updated = await Issue.findByIdAndUpdate(id, { status });

    return res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}
