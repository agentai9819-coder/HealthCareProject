export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    requestId: string;
    timestamp: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  appointmentSlotId: string;
  status: BookingStatus;
  customer_intake_notes?: string | null;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_postal_code?: string;
  created_at: string;
}

export enum Role {
  Customer = "CUSTOMER",
  Staff = "STAFF",
  Admin = "ADMIN",
}

export enum BookingStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
}

export enum VisitStatus {
  Confirmed = "CONFIRMED",
  EnRoute = "EN_ROUTE",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
}

export interface CustomerBookingSummary {
  id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  appointmentSlotId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  customerIntakeNotes?: string | null;
  customerSummary?: string | null;
  completedAt?: string | null;
  visitStatus?: VisitStatus | null;
  address_street?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  address_postal_code?: string | null;
  created_at: string;
}

export interface CustomerName {
  firstName: string;
  lastName: string;
}

export interface CustomerProfile {
  id: string;
  name: CustomerName | string;
  email: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name: CustomerName;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerAddressPayload {
  label?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UpdateCustomerAddressPayload {
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface RescheduleBookingPayload {
  newAppointmentSlotId: string;
}

export interface ChangeBookingAddressPayload {
  addressId: string;
}

export interface RebookBookingPayload {
  appointmentSlotId: string;
  addressId: string;
}

export interface UpdateCustomerIntakePayload {
  intakeNotes: string;
}

// ---------------------------------------------------------------------------
// Phase 2H: Staff & Visit Entities and Payloads
// ---------------------------------------------------------------------------

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: Role.Staff | Role.Admin;
  specialty?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfile {
  id: string;
  name: string;
  email: string;
  role: Role.Staff | Role.Admin;
  specialty?: string | null;
  phone?: string | null;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  phone?: string;
}

export interface UpdateStaffStatusPayload {
  isActive: boolean;
}

export interface Visit {
  id: string;
  bookingId: string;
  status: VisitStatus;
  enRouteAt?: string | null;
  inProgressAt?: string | null;
  completedAt?: string | null;
  completedByStaffId?: string | null;
  staffNotes?: string | null;
  customerSummary?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VisitStaffAssignment {
  id: string;
  visitId: string;
  staffId: string;
  assignedById: string;
  isActive: boolean;
  isParticipating: boolean;
  hasElevatedAccess: boolean;
  assignedAt: string;
  unassignedAt?: string | null;
  reassignmentReason?: string | null;
}

export interface StaffAssignedVisit {
  id: string;
  bookingId: string;
  status: VisitStatus;
  customerName: string;
  customerEmail?: string | null;
  serviceName: string;
  serviceDuration: number;
  startTime: string;
  endTime: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  customerIntakeNotes?: string | null;
  hasElevatedAccess: boolean;
  enRouteAt?: string | null;
  inProgressAt?: string | null;
  completedAt?: string | null;
  staffNotes?: string | null;
  customerSummary?: string | null;
  assignedStaff: Array<{
    staffId: string;
    name: string;
    specialty?: string | null;
    isActive: boolean;
    isParticipating: boolean;
  }>;
}

export interface AdminVisitOverview {
  id: string;
  bookingId: string;
  status: VisitStatus;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  customerIntakeNotes?: string | null;
  enRouteAt?: string | null;
  inProgressAt?: string | null;
  completedAt?: string | null;
  completedByStaffId?: string | null;
  completedByName?: string | null;
  staffNotes?: string | null;
  customerSummary?: string | null;
  assignedStaff: Array<{
    assignmentId: string;
    staffId: string;
    name: string;
    role: string;
    specialty?: string | null;
    isActive: boolean;
    isParticipating: boolean;
    hasElevatedAccess: boolean;
    assignedAt: string;
    unassignedAt?: string | null;
    reassignmentReason?: string | null;
  }>;
}

export interface TransitionVisitStatusPayload {
  status: VisitStatus.EnRoute | VisitStatus.InProgress;
}

export interface CompleteVisitPayload {
  staffNotes: string;
  customerSummary: string;
  participatingStaffIds?: string[];
}

export interface AssignStaffPayload {
  staffIds: string[];
}

export interface ReassignStaffPayload {
  removeStaffId: string;
  addStaffId: string;
  reason: string;
}

export interface SetElevatedAccessPayload {
  hasElevatedAccess: boolean;
}