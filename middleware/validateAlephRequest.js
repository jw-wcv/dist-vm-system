function validateAlephRequest(req, res, next) {
    const { vcpus, memory, sshKeyName } = req.body;
    if (!vcpus || !memory || !sshKeyName) {
      return res.status(400).json({ error: "Missing required fields: vcpus, memory, sshKeyName" });
    }
    next();
  }
  
  module.exports = validateAlephRequest;
  