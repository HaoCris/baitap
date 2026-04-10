const EventEmitter = require("events");

const domainEvents = new EventEmitter();

const DOMAIN_EVENTS = {
  TICKET_ENTRY_VALIDATED: "ticket.entry.validated",
  TICKET_MANUAL_INSPECTION_CREATED: "ticket.manualInspection.created",
  REPORT_CREATED: "report.created",
  REPORT_STATUS_CHANGED: "report.status.changed",
};

module.exports = {
  domainEvents,
  DOMAIN_EVENTS,
};
