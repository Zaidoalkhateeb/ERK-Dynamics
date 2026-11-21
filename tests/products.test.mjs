import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { publishedProducts } from "../src/content/products.ts";
import { productMedia } from "../src/content/product-media.ts";
import { productImages } from "../src/content/home.ts";
import { exoskeletons } from "../src/content/portfolio.ts";

test("every published product has a complete media set and a reachable portfolio entry", () => {
  assert.ok(publishedProducts.length > 0);
  assert.equal(
    new Set(publishedProducts.map((product) => product.slug)).size,
    publishedProducts.length,
  );
  for (const product of publishedProducts) {
    const media = productMedia[product.slug];
    assert.ok(media, `${product.slug}: missing product media`);
    assert.equal(
      media.story.length,
      product.features.length,
      `${product.slug}: feature/image mismatch`,
    );
    assert.ok(
      product.features.every((feature) => feature.trim()),
      `${product.slug}: blank feature`,
    );
    assert.ok(exoskeletons.some((item) => item.href === `/products/${product.slug}`));
    for (const asset of [media.hero, ...media.story, media.cta, productImages[product.slug]]) {
      assert.ok(
        asset && existsSync(new URL(`../public${asset}`, import.meta.url)),
        `Missing asset: ${asset}`,
      );
    }
  }
});
