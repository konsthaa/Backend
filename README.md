Backend assignment2



## Authentication and authorization

Login with `POST /api/v1/auth/login`; send the returned token as
`Authorization: Bearer <token>` to protected routes.

Creating cats, updating or deleting cats, and updating or deleting users require
authentication. Regular users can update or delete only their own user record
and cats. Cat ownership is taken from the authenticated user, not the request
body. Admin users can update or delete any user or cat. Public registration
always creates a regular user.
