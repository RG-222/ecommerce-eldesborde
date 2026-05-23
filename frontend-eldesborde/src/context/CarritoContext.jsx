import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const CarritoContext =
  createContext();

export const CarritoProvider =
({ children }) => {

  const [carrito, setCarrito] = useState(() => {

        const guardado = localStorage.getItem( 'carrito' );

        return guardado
          ? JSON.parse(guardado)
          : [];
      });

  useEffect(() => {

    localStorage.setItem(
      'carrito',
      JSON.stringify(carrito)
    );

  }, [carrito]);

  const agregarAlCarrito =
    (producto) => {

      const existe =
        carrito.find(
          p => p.id === producto.id
        );

      // si ya existe
      if (existe) {

        if (
          existe.cantidad
          >= producto.stock
        ) {

          alert(
            'No hay más stock disponible'
          );

          return;
        }

        const actualizado =
          carrito.map(p =>

            p.id === producto.id
              ? {
                  ...p,
                  cantidad:
                    p.cantidad + 1
                }
              : p
          );

        setCarrito(
          actualizado
        );

      } else {

        setCarrito([
          ...carrito,
          {
            ...producto,
            cantidad: 1
          }
        ]);
      }
    };

  const eliminarDelCarrito =
    (id) => {

      setCarrito(
        carrito.filter(
          p => p.id !== id
        )
      );
    };

  const vaciarCarrito =
    () => {

      setCarrito([]);
    };

  const total =
    carrito.reduce(
      (acc, item) =>
        acc +
        item.precio *
        item.cantidad,
      0
    );

  return (

    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        total
      }}
    >

      {children}

    </CarritoContext.Provider>
  );
};

export const useCarrito =
() => useContext(
  CarritoContext
);