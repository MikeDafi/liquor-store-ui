import { categories } from '../data/products';

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl mb-8">Shop by Category</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <a
            key={category.id}
            href={`/category/${category.id}`}
            className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:shadow-lg transition-shadow"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-white">{category.name}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
