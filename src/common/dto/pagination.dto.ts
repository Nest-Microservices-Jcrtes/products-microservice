import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

// Mi endpoint puede recibir page y limit, ambos deben ser números positivos y son opcionales.
export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number )
    // Si el usuario no manda page, utilizaremos 1.
    page?: number = 1;


    @IsPositive()
    @IsOptional()
    @Type(() => Number )
    // Si el usuario no indica cuántos productos quiere, devolveremos 10.
    limit?: number = 10;
}