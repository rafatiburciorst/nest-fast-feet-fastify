import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { z } from "nestjs-zod/z";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "src/env";

const tokenSchema = z.object({
    sub: z.string(),
    roles: z.string().nullable()
})

export type AuthToken = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly config: ConfigService<Env, true>) {
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, 'base64'),
            algorithms: ['RS256']
        })
    }

    async validate(payload: AuthToken) {
        return tokenSchema.parse(payload)
    }
}