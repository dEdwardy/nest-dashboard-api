import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, Request } from 'express';
import { nanoid } from 'nanoid'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use (req: Request, res: Response, next: () => void) {
    const headerName = 'X-Request-Id'
    const headerId = req.get(headerName)
    const requestId = headerId ? headerId : nanoid()
    req[requestId] = requestId
    res.set(headerName, requestId)
    next();
  }
}
