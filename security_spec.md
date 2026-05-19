# Security Specification

## Data Invariants

- A user profile must match their authenticated ID.
- A project must belong to the user (`ownerId == request.auth.uid`). Only the owner can create, update, or delete it, for now.
- Transactions and materials within a project can only be read/written if the user is the owner of the project.

## Dirty Dozen Payloads

1. Unauthenticated read of User
2. Read User profile of another user
3. Write User profile as a different user
4. Create project with missing ownerId
5. Create project where ownerId is different from request.auth.uid
6. Create project without required fields (e.g. name, address)
7. Non-owner trying to update project
8. Owner trying to update project's ownerId
9. Non-owner trying to read project
10. Creating a transaction for a project the user does not own
11. Reading materials from a project the user does not own
12. Creating a transaction with missing required fields

## Test Runner
(Will be implemented in `firestore.rules.test.ts`)
