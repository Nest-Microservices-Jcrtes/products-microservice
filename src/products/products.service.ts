import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common/dto';


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    // return product;
  }
  async findAll( paginationDto: PaginationDto) {
    // se utilizan los valores predeterminados en caso en la petición no se manden parametros 
    // Aqui se esta haciendo la desestructuración 
    const { page = 1, limit = 10 } = paginationDto;

    // Contiene el número total de productos.
    const totalPages = await this.prisma.product.count({ where: { available: true }});
    // Lo que hace es calcular el número de páginas que se necesitan para mostrar todos los productos, dado el límite de productos por página.
    const lastPage = Math.ceil( totalPages / limit );

    return {
      data: await this.prisma.product.findMany({
        // ¿Cuántos registros debo saltarme?
        // Esta fórmula es la que permite cambiar de página.
      skip: ( page - 1 ) * limit,
      // ¿Cuántos registros debo obtener?
      take: limit, 
      where: {
        available: true,
      }
    }),
    meta: {
      // Esto es lo que devuelve meta es un ejemplo 
//         {
//   "data": [
//     "...productos 11 al 20..."
//   ],
//   "meta": {
//     "total": 30,
//     "page": 2,
//     "lastPages": 3
//   }
// }
      total: totalPages,
      page: page,
      lastPages: lastPage,
    }
    }
  }

  async findOne(id: number) {
    const product= await this.prisma.product.findFirst({
      where: { id, available: true }
    });
    if ( !product ){
      throw new NotFoundException(`Product with id #${ id } not found`)
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id: __, ...data} = updateProductDto;

    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: data,
    })
  }

  async remove(id: number) {

    await this.findOne( id );

    // !ESTA SI ES UNA ELIMINACIÓN FISICA YA QUE EL PRODUCTO QUE ESTA LA BASE DE DATOS SI LOS ELIMA DIRECTAMENTE
    // return this.prisma.product.delete({

    //   where: { id }

    // })

    //!ESTA ES UNA ELIMINACIÓN SUAVE OSEA QUE NO LO ELIMINAR EL RESGITRO DE LA BASE DE DATOS SIMPLEMNETE EN EL ARECHIVO SCHEMA.PRISMA SE AGREGO UN NUEVO CAMPO EN EL CUAL
    // ! SE LLAMA AVAILABLE Y ESE SOLO MARCA COMO NO DISPONIBLE 
    const product = await this.prisma.product.update({

      where: { id },

      data: {

        available: false

      }

    });

    return product;

  }


}
