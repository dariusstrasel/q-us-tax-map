import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class StaticController {
    @Get()
    root(@Res() res: Response) {
        res.sendFile(join(process.cwd(), 'public', 'index.html'));
    }
}