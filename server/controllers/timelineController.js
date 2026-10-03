import TimelineEvent from '../models/TimelineEvent.js';
import Milestone from '../models/Milestone.js';

export async function getTimeline(req, res, next) {
  try {
    const { id } = req.params;
    const events = await TimelineEvent.find({ projectId: id });
    const milestones = await Milestone.find({ projectId: id });

    // Sort events chronologically
    const sorted = [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return res.status(200).json({
      success: true,
      data: {
        events: sorted,
        milestones
      }
    });
  } catch (err) {
    next(err);
  }
}
