import Decision from '../models/Decision.js';

export async function listDecisions(req, res, next) {
  try {
    const { id } = req.params;
    const decisions = await Decision.find({ projectId: id });
    return res.status(200).json({
      success: true,
      data: decisions
    });
  } catch (err) {
    next(err);
  }
}
