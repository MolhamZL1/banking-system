# Bank API Documentation (Quick)

## App url : https://bank-app-fcf3e0266562.hosted.ghaymah.systems/

## API collection : https://web.postman.co/workspace/My-Workspace~c0395906-0a62-4dd1-83c1-7d9cc2c3e262/collection/31065407-57c2c3e8-f92e-457d-bb8d-84da34072bcc?action=share&source=copy-link&creator=31065407

## Diagrams (UML)

All diagrams are stored under:

- `uml/` → Class and Sequence diagrams for design patterns used in the system

---

## Auth

- `POST /api/auth/register` create customer (email not verified yet)
- `POST /api/auth/resend-code` resend verification code
- `POST /api/auth/verify-email` verify email; returns tokens
- `POST /api/auth/login` returns tokens
- `POST /api/auth/refresh` rotates refresh token; returns new tokens
- `POST /api/auth/logout`
- `GET /api/auth/me` (Bearer)

## Accounts

- `GET /api/accounts` list accounts (Customer: own; Staff can add `?userId=ID`)
- `GET /api/accounts/search` search/filter accounts (auth required)
- `POST /api/accounts/create` (ADMIN/TELLER) create account
- `GET /api/accounts/:id` get account
- `PATCH /api/accounts/:id/rename` rename account
- `PATCH /api/accounts/state/:id` (ADMIN/TELLER) state action: FREEZE|SUSPEND|ACTIVATE|CLOSE

### Decorator Features (Design Pattern)

> Class Diagram: `docs/diagrams/class/design-patterns/decorator-accounts.png`  
> Sequence Diagrams: `docs/diagrams/sequence/accounts/add-remove-feature.png`

- `POST /api/accounts/:id/features` add feature: PREMIUM|INSURANCE|OVERDRAFT_PLUS
- `DELETE /api/accounts/:id/features/:type` remove feature

### Composite Groups (Design Pattern)

> Class Diagram: `docs/diagrams/class/design-patterns/composite-account-groups.png`  
> Sequence Diagram: `docs/diagrams/sequence/accounts/groups-create-add-remove-child.png`

- `POST /api/accounts/groups/create` create group with childAccountIds
- `POST /api/accounts/groups/:groupId/children` add child
- `DELETE /api/accounts/groups/:groupId/children/:childId` remove child

## Transactions

> Sequence Diagrams: `docs/diagrams/sequence/transactions/`

- `POST /api/transactions` create transaction (DEPOSIT/WITHDRAWAL/TRANSFER). May be PENDING if approval needed.
- `GET /api/transactions/pending` (ADMIN/TELLER/MANAGER) list pending
- `PATCH /api/transactions/:id/approve` (ADMIN/TELLER/MANAGER) approve
- `PATCH /api/transactions/:id/reject` (ADMIN/TELLER/MANAGER) reject

## Scheduled Transactions

> Sequence Diagrams: `docs/diagrams/sequence/scheduled-transactions/`

- `POST /api/scheduled-transactions` create (frequency DAILY/WEEKLY/MONTHLY)
- `GET /api/scheduled-transactions` list mine
- `PATCH /api/scheduled-transactions/:id/stop`
- `PATCH /api/scheduled-transactions/:id/resume`

## Notifications

> Sequence Diagrams: `docs/diagrams/sequence/notifications/`

- `GET /api/notifications` list mine
- `PATCH /api/notifications/:id/read` mark read

## Tickets

> Sequence Diagrams: `docs/diagrams/sequence/tickets/`

- `POST /api/tickets` create
- `GET /api/tickets` list (Customer: own; Staff: all)
- `PATCH /api/tickets/:id/status` (ADMIN/TELLER/MANAGER) set status OPEN|IN_PROGRESS|CLOSED

## Events

> Sequence Diagram: `docs/diagrams/sequence/events/list.png`

- `GET /api/events` list (Customer: own; Staff can add `?userId=ID`)
