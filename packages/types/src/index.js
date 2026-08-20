"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitStatus = exports.BookingStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Customer"] = "CUSTOMER";
    Role["Staff"] = "STAFF";
    Role["Admin"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["Pending"] = "PENDING";
    BookingStatus["Confirmed"] = "CONFIRMED";
    BookingStatus["Cancelled"] = "CANCELLED";
    BookingStatus["Completed"] = "COMPLETED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var VisitStatus;
(function (VisitStatus) {
    VisitStatus["Confirmed"] = "CONFIRMED";
    VisitStatus["EnRoute"] = "EN_ROUTE";
    VisitStatus["InProgress"] = "IN_PROGRESS";
    VisitStatus["Completed"] = "COMPLETED";
    VisitStatus["Cancelled"] = "CANCELLED";
})(VisitStatus || (exports.VisitStatus = VisitStatus = {}));
