# Auth Specification

## Purpose

Authentication and user management for the concrete plant management system. Defines JWT-based auth endpoints and the `UserRole` enum. Role-based authorization is DEFERRED — in slice 1, all authenticated users are treated as admins.

---

## Enums

### Requirement: UserRole Enum

The system MUST define a `UserRole` enum with values `ADMIN` and `OPERADOR`. The `User.role` field MUST default to `ADMIN`.

#### Scenario: New user gets ADMIN role

- GIVEN a new User is created via registration
- WHEN the User record is persisted
- THEN `role` is set to `ADMIN`

#### Scenario: Existing users default to ADMIN

- GIVEN existing User rows exist before the migration adding `UserRole`
- WHEN the migration runs
- THEN all existing Users have `role = ADMIN`

---

## Endpoints

### Requirement: Register User

`POST /api/auth/register` — Creates a new user with email and password.

**Request body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | yes | unique, valid email format |
| `password` | string | yes | min 8 chars, hashed with bcrypt |

**Response 201:** `{ userId: number, email: string }`

#### Scenario: User registered successfully

- GIVEN a payload with valid email and password
- WHEN POST /api/auth/register is called
- THEN 201 is returned with `userId` and `email`

#### Scenario: Duplicate email conflict

- GIVEN an existing User with email "admin@plant.com"
- WHEN POST /api/auth/register is called with the same email
- THEN 409 is returned with error indicating email already exists

#### Scenario: Missing required field

- GIVEN a payload with only `email` (no password)
- WHEN POST /api/auth/register is called
- THEN 400 is returned with validation error

### Requirement: Login User

`POST /api/auth/login` — Authenticates a user and returns a JWT.

**Request body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | yes | — |
| `password` | string | yes | — |

**Response 200:** `{ token: string }`

#### Scenario: Login successful

- GIVEN valid email and password credentials
- WHEN POST /api/auth/login is called
- THEN 200 is returned with a JWT token

#### Scenario: Invalid credentials

- GIVEN a wrong password for an existing email
- WHEN POST /api/auth/login is called
- THEN 401 is returned with error "Invalid credentials"

### Requirement: Get Current User

`GET /api/auth/me` — Returns the authenticated user's profile. Requires valid JWT in `Authorization: Bearer <token>`.

**Response 200:** `{ id: number, email: string, role: UserRole }`

#### Scenario: Valid token returns user

- GIVEN a valid JWT for user id=1
- WHEN GET /api/auth/me is called with the token
- THEN 200 is returned with `id`, `email`, and `role`

#### Scenario: No token returns 401

- GIVEN no Authorization header
- WHEN GET /api/auth/me is called
- THEN 401 is returned with error "Access denied"

#### Scenario: Expired token returns 401

- GIVEN an expired JWT
- WHEN GET /api/auth/me is called with the expired token
- THEN 401 is returned with error "Access denied"

---

## Error States

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Validation failed (missing fields, bad format) | `{ error: "Validation failed", details: {...} }` |
| 401 | No token, expired token, or invalid credentials | `{ error: "Access denied" }` or `{ error: "Invalid credentials" }` |
| 409 | Duplicate email on registration | `{ error: "Email already exists" }` |

---

## Deferred Behavior

### Requirement: Role-Based Authorization

Role-based access control is DEFERRED beyond slice 1. In slice 1, all authenticated users are treated as admins with full access.

#### Scenario: OPERADOR has full access in slice 1

- GIVEN a User with `role = OPERADOR`
- WHEN any authenticated endpoint is called
- THEN the request is allowed (no role check)
