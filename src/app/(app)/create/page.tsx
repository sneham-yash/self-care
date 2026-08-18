import { Suspense } from "react";

import { CreateCareItemPage } from "@/components/create/create-care-item-page";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
      <CreateCareItemPage />
    </Suspense>
  );
}
