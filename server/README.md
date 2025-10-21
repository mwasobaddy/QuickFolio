# QuickFolio Server

Serverless Node.js backend for QuickFolio application using Vercel and PostgreSQL.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` with your PostgreSQL connection string.

3. Set up the database:
   ```bash
   npm run db:push
   ```

4. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

## Development

Start the development server:
```bash
npm run dev
```

## API Endpoints

### Folios

- `GET /api/folios` - Get all folios
- `GET /api/folios?id={id}` - Get a specific folio
- `POST /api/folios` - Create a new folio
- `PUT /api/folios?id={id}` - Update a folio
- `DELETE /api/folios?id={id}` - Delete a folio

### Request/Response Examples

#### Create Folio
```json
POST /api/folios
{
  "item": "KeNHA/05/GEN/Vol.7/0673",
  "runningNo": "0673",
  "description": "Sample description",
  "draftedBy": "John Doe",
  "letterDate": "2023-10-22T00:00:00.000Z"
}
```

#### Response
```json
{
  "data": {
    "id": "cl1234567890",
    "item": "KeNHA/05/GEN/Vol.7/0673",
    "runningNo": "0673",
    "description": "Sample description",
    "draftedBy": "John Doe",
    "letterDate": "2023-10-22T00:00:00.000Z",
    "createdAt": "2023-10-22T10:00:00.000Z",
    "updatedAt": "2023-10-22T10:00:00.000Z"
  }
}
```

## Database Schema

The `folios` table contains:
- `id`: Unique identifier
- `item`: Folio number (e.g., KeNHA/05/GEN/Vol.7/0673)
- `runningNo`: Running number extracted from item (e.g., 0673)
- `description`: Optional description
- `draftedBy`: Name of the person who drafted
- `letterDate`: Date of the letter
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

## Deployment

Deploy to Vercel:
```bash
vercel --prod
```

Make sure to set the `DATABASE_URL` environment variable in Vercel dashboard.