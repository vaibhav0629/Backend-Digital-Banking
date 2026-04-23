# Backend Programming UTS (2026)

### Daffa Prawira - 535220199

### Vaibhav - 535250002

### Nickson Kiyoshi - 525250007

### Denzel Mark Wahyudi - 535250015

### Catherine Zefanya Lorens Lukyto - 535250024

---

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`.
5. Open `.env` and set the variable `DB_CONNECTION` to the database connection string, `SECRET_KEY` to your encription key, `RANDOM_KEY` to any value.
6. Run `npm install` to install the project dependencies.
7. Run `npm run dev` to start the dev server.

## Endpoints Documentation

### Authentication Components

Endpoints:

1. POST `localhost:<portNum>/api/auth/register`. Membuat sign-in baru untuk user dengan form dan menyimpannya ke database.

Body:

```json
{
  "email": "yourEmailAddress",
  "password": "yourPassword",
  "confirm_password": "yourPassword",
  "full_name": "yourName",
  "role": "user or admin"
}
```

Additional Notes:

- A user has the role value set to `user` by default.
- A role can only have the value `user` or `admin`.
- Password must have `length > 8`.

Example Result:
![Example of User Register](https://github.com/EndlessWay1/images/blob/main/ExampleofUserRegister.png?raw=true)

2. POST `localhost:<portNum>/api/auth/login`. Membuat login `token` untuk user agar dapat masuk dengan form, dan konfirmasi password dan username ke database. Token ini hanya akan valid selama 15 menit karena security.

Body:

```json
{
  "email": "yourEmailAddress",
  "password": "yourPassword"
}
```

Result:

```json
{
  "email": "yourEmailAddress",
  "role": "user",
  "token": "yourLoginToken"
}
```

Additional Notes:

- To access this endpoint, you must first register to have a user.
- To use this token, on header use `Authentication` with the value `JWT yourLoginToken`

Example Result:
![Example of User Login](https://github.com/EndlessWay1/images/blob/main/ExampleofUserLogin.png?raw=true)

2. POST `localhost:<portNum>/api/auth/transaction`. Membuat transaction token untuk `user` agar dapat melakukan transaksi dengan token login, account `pin` dan `accountType`. Token ini hanya akan valid selama 15 menit karena security.

Body:

```json
{
  "pin": "yourAccountPin",
  "accountType": "yourAccountType"
}
```

Header:

![Header image](https://github.com/EndlessWay1/images/blob/main/Data%20Header%20Transaction%20Token.png?raw=true)

Result:

```json
{
  "token": "yourTransactionToken"
}
```

Aditional Notes:

- Endpoint ini menggunakan login token yang dapat diakses di POST `/api/auth/login` dan menaruhnya di header.
- Endpoint ini menggunakan Account yang telah dibuat sebelumnya pada POST `/api/accounts`.

Example Result:

![Example of Account Transaction Token](https://github.com/EndlessWay1/images/blob/main/Data%20Body%20Transaction%20Token%20Example.png?raw=true)

### Users Components

Endpoints:

1. GET `localhost:<portNum>/api/users`. Memberikan informasi Users dengan Token dari login.

Header:

![Header image](https://github.com/EndlessWay1/images/blob/main/Data%20Header%20Transaction%20Token.png?raw=true)

Aditional Notes:

- Endpoint ini menggunakan login token yang dapat diakses di POST `/api/auth/login` dan menaruhnya di header.

2. PUT `localhost:<portNum>/api/users`. Mengupdate `full_name` atau `email`.

Body:

```json
{
  "email": "yourNewEmail",
  "full_name": "yourNewName"
}
```

Header:

![Header image](https://github.com/EndlessWay1/images/blob/main/Data%20Header%20Transaction%20Token.png?raw=true)

Aditional Notes:

- Endpoint ini menggunakan login token yang dapat diakses di POST `/api/auth/login` dan menaruhnya di header.
- `Email` disini harus belum pernah terdaftar di database.

3. PUT `localhost:<portNum>/api/users/change-password`. Mengubah password `User` yang dibuat.

Body:

```json
{
  "old_password": "yourOldPassword",
  "new_password": "yourNewPassword",
  "confirm_new_password": "yourNewPassword"
}
```

Header:

![Header image](https://github.com/EndlessWay1/images/blob/main/Data%20Header%20Transaction%20Token.png?raw=true)

Aditional Notes:

- Endpoint ini menggunakan login token yang dapat diakses di POST `/api/auth/login` dan menaruhnya di header.
- `old_password` dengan `new_password` tidak boleh sama.
- `confirm_new_password` harus sama dengan `new_password`.

3. DELETE `localhost:<portNum>/api/users`. Mendelete `user` yang ada di database.

Header:

![Header image](https://github.com/EndlessWay1/images/blob/main/Data%20Header%20Transaction%20Token.png?raw=true)

Aditional Notes:

- Endpoint ini menggunakan login token yang dapat diakses di POST `/api/auth/login` dan menaruhnya di header.
