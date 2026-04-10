const { Server } = require("socket.io");
const { verifyAccessToken } = require("../services/token.service");
const User = require("../models/user.model");
const { domainEvents, DOMAIN_EVENTS } = require("../events/domainEvents");

let ioInstance = null;

async function socketAuth(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (!user || !user.isActive) {
      return next(new Error("Unauthorized"));
    }

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
}

function attachDomainEventListeners(io) {
  domainEvents.on(DOMAIN_EVENTS.TICKET_ENTRY_VALIDATED, (payload) => {
    io.to("role:staff").to("role:admin").emit("metro.ticket.entryValidated", payload);
  });

  domainEvents.on(DOMAIN_EVENTS.TICKET_MANUAL_INSPECTION_CREATED, (payload) => {
    io.to("role:inspector").to("role:admin").emit("metro.ticket.manualInspectionCreated", payload);
  });

  domainEvents.on(DOMAIN_EVENTS.REPORT_CREATED, (payload) => {
    io.to("role:admin").emit("report.created", payload);
  });

  domainEvents.on(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, (payload) => {
    io.to("role:admin").emit("report.statusChanged", payload);
  });
}

function initializeSocket(server) {
  if (ioInstance) {
    return ioInstance;
  }

  ioInstance = new Server(server, {
    cors: { origin: "*" },
  });

  ioInstance.use(socketAuth);

  ioInstance.on("connection", (socket) => {
    socket.join(`role:${socket.user.role}`);
    socket.join(`user:${socket.user._id}`);

    socket.emit("socket.ready", {
      userId: socket.user._id,
      role: socket.user.role,
    });
  });

  attachDomainEventListeners(ioInstance);

  return ioInstance;
}

function getIo() {
  return ioInstance;
}

async function closeSocket() {
  if (ioInstance) {
    domainEvents.removeAllListeners();
    await ioInstance.close();
    ioInstance = null;
  }
}

module.exports = {
  initializeSocket,
  getIo,
  closeSocket,
};
