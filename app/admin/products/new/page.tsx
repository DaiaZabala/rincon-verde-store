// app/admin/products/new/page.tsx

import CreateProductPage from "../create/page";

export default function NewProductWrapper() {
  // Simple wrapper so /admin/products/new works the same as /admin/products/create
  return <CreateProductPage />;
}
