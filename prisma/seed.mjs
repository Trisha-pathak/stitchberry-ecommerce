import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding StitchBerry pastel database...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const customerHash = await bcrypt.hash("pastel123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@stitchberry.in" },
    update: {},
    create: {
      name: "Meera (Studio Founder)",
      email: "admin@stitchberry.in",
      passwordHash: adminHash,
      phone: "+91 98765 43210",
      role: "ADMIN",
      avatarColor: "#BFE3F5",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "ananya@stitchberry.in" },
    update: {},
    create: {
      name: "Ananya Sharma",
      email: "ananya@stitchberry.in",
      passwordHash: customerHash,
      phone: "+91 98201 55443",
      role: "CUSTOMER",
      avatarColor: "#F7C6D9",
    },
  });

  await prisma.address.deleteMany({ where: { userId: customer.id } });
  await prisma.address.createMany({
    data: [
      {
        userId: customer.id,
        label: "Home",
        fullName: "Ananya Sharma",
        phone: "+91 98201 55443",
        line1: "402 Roseberry Apartments, 14th Road",
        line2: "Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        isDefault: true,
      },
      {
        userId: customer.id,
        label: "Studio Office",
        fullName: "Ananya Sharma",
        phone: "+91 98201 55443",
        line1: "18 Pastel Arcade, Indiranagar",
        line2: "100 Feet Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        isDefault: false,
      },
    ],
  });

  const productsData = [
    {
      slug: "cotton-candy-tulip-bouquet",
      name: "Cotton Candy Tulip Bouquet",
      category: "Crochet Flowers & Bouquets",
      description:
        "Five hand-crocheted forever tulips wrapped in soft vanilla linen paper and tied with a baby-pink satin ribbon. Never wilts, smells softly of lavender sachet if requested, and brightens every desk or bedside.",
      specifications:
        "100% combed cotton milk yarn • Bendable floral wire stems • Height: 34 cm • Hand-wrapped gift paper included",
      price: 1299,
      compareAtPrice: 1599,
      stock: 14,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Powder Pink", hex: "#F7C6D9" },
        { name: "Powder Blue", hex: "#BFE3F5" },
        { name: "Butter Yellow", hex: "#FFF0B8" },
      ]),
      sizesJson: JSON.stringify(["5 Stems", "9 Stems", "12 Stems"]),
      imagesJson: JSON.stringify([
        "/images/products/cotton-candy-tulip-bouquet-1.svg",
        "/images/products/cotton-candy-tulip-bouquet-2.svg",
        "/images/products/cotton-candy-tulip-bouquet-3.svg",
      ]),
      ratingAvg: 4.9,
      ratingCount: 2,
      popularity: 98,
      isFeatured: true,
      isSeasonal: false,
    },
    {
      slug: "blueberry-cloud-tote",
      name: "Blueberry Cloud Tote",
      category: "Crochet Bags & Purses",
      description:
        "A dreamy puffy granny-square market and brunch tote crocheted in powder blue, soft lavender, and vanilla cream. Features reinforced double-knit straps and a breathable cotton lining with an inner pocket.",
      specifications:
        "Mercerized cotton yarn • Cotton canvas lining • Magnetic snap button • Fits 14-inch laptop • 36 x 34 cm",
      price: 1899,
      compareAtPrice: 2299,
      stock: 8,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Powder Blue", hex: "#BFE3F5" },
        { name: "Soft Lavender", hex: "#E7DDF7" },
        { name: "Vanilla Cream", hex: "#FFF8ED" },
      ]),
      sizesJson: JSON.stringify(["Regular Tote", "Oversized Carryall"]),
      imagesJson: JSON.stringify([
        "/images/products/blueberry-cloud-tote-1.svg",
        "/images/products/blueberry-cloud-tote-2.svg",
        "/images/products/blueberry-cloud-tote-3.svg",
      ]),
      ratingAvg: 4.8,
      ratingCount: 2,
      popularity: 94,
      isFeatured: true,
      isSeasonal: false,
    },
    {
      slug: "strawberry-milk-bunny-plushie",
      name: "Strawberry Milk Bunny Plushie",
      category: "Crochet Plushies & Toys",
      description:
        "Ultra-squishy huggable bunny crafted with velvety chenille yarn, embroidered sleepy eyes (baby-safe, zero plastic parts), and a removable butter-yellow bow.",
      specifications:
        "Hypoallergenic micro-chenille • Embroidered safety features • Height: 26 cm • Gentle hand-washable",
      price: 1450,
      compareAtPrice: 1750,
      stock: 4,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Baby Pink", hex: "#FADCE8" },
        { name: "Vanilla Cream", hex: "#FFF8ED" },
        { name: "Butter Yellow", hex: "#FFF0B8" },
      ]),
      sizesJson: JSON.stringify(["Cuddle Size (26 cm)", "Jumbo Hug (38 cm)"]),
      imagesJson: JSON.stringify([
        "/images/products/strawberry-milk-bunny-plushie-1.svg",
        "/images/products/strawberry-milk-bunny-plushie-2.svg",
        "/images/products/strawberry-milk-bunny-plushie-3.svg",
      ]),
      ratingAvg: 5.0,
      ratingCount: 1,
      popularity: 96,
      isFeatured: true,
      isSeasonal: false,
    },
    {
      slug: "daisy-puff-keychain-duo",
      name: "Daisy Puff Keychain Duo",
      category: "Crochet Keychains",
      description:
        "A cheerful pair of puffy smiling crochet daisies with gold-toned star clasps. Clip one on your tote and gift the twin to your best friend.",
      specifications:
        "4-ply soft cotton • Brass star keyring • Diameter: 7 cm • Pack of 2 charms",
      price: 499,
      compareAtPrice: 649,
      stock: 25,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Butter Yellow", hex: "#FFF0B8" },
        { name: "Powder Pink", hex: "#F7C6D9" },
        { name: "Powder Blue", hex: "#BFE3F5" },
      ]),
      sizesJson: JSON.stringify(["Set of 2"]),
      imagesJson: JSON.stringify([
        "/images/products/daisy-puff-keychain-duo-1.svg",
        "/images/products/daisy-puff-keychain-duo-2.svg",
        "/images/products/daisy-puff-keychain-duo-3.svg",
      ]),
      ratingAvg: 4.9,
      ratingCount: 1,
      popularity: 91,
      isFeatured: true,
      isSeasonal: false,
    },
    {
      slug: "lavender-dream-scrunchie-set",
      name: "Lavender Dream Scrunchie Set",
      category: "Crochet Accessories",
      description:
        "Ruffled crochet hair scrunchies with picot lace edges in soft lavender, baby pink, and powder blue. Gentle on curls and adds instant cottagecore charm.",
      specifications:
        "Soft bamboo-cotton blend • High-recovery inner elastic • Set of 3 scrunchies",
      price: 649,
      compareAtPrice: 799,
      stock: 18,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Soft Lavender", hex: "#E7DDF7" },
        { name: "Baby Pink", hex: "#FADCE8" },
        { name: "Powder Blue", hex: "#BFE3F5" },
      ]),
      sizesJson: JSON.stringify(["Standard Puff", "XL Ruffle"]),
      imagesJson: JSON.stringify([
        "/images/products/lavender-dream-scrunchie-set-1.svg",
        "/images/products/lavender-dream-scrunchie-set-2.svg",
        "/images/products/lavender-dream-scrunchie-set-3.svg",
      ]),
      ratingAvg: 4.7,
      ratingCount: 1,
      popularity: 83,
      isFeatured: false,
      isSeasonal: false,
    },
    {
      slug: "vanilla-scallop-coaster-quartet",
      name: "Vanilla Scallop Coasters",
      category: "Crochet Home Decor",
      description:
        "Set of four thick scalloped mug coasters stitched in vanilla cream with pastel picot borders. Protects wooden tables while turning tea-time into a bakery vignette.",
      specifications:
        "Heavyweight 8-ply cotton • Diameter: 11.5 cm • Set of 4 coasters with ribbon tie",
      price: 749,
      compareAtPrice: 899,
      stock: 15,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Vanilla Cream", hex: "#FFF8ED" },
        { name: "Powder Pink", hex: "#F7C6D9" },
        { name: "Powder Blue", hex: "#BFE3F5" },
      ]),
      sizesJson: JSON.stringify(["Set of 4", "Set of 6"]),
      imagesJson: JSON.stringify([
        "/images/products/vanilla-scallop-coaster-quartet-1.svg",
        "/images/products/vanilla-scallop-coaster-quartet-2.svg",
        "/images/products/vanilla-scallop-coaster-quartet-3.svg",
      ]),
      ratingAvg: 4.8,
      ratingCount: 1,
      popularity: 80,
      isFeatured: false,
      isSeasonal: false,
    },
    {
      slug: "pastel-granny-square-cardigan",
      name: "Pastel Granny Square Cardigan",
      category: "Crochet Clothing",
      description:
        "Hand-assembled cloud-soft cardigan made from 44 pastel daisy granny squares, ribbed cuffs, and pearl-shaped buttons. Cozy without feeling heavy.",
      specifications:
        "Breathable anti-pill acrylic & cotton blend • Pearlized buttons • Handcrafted over 18 hours",
      price: 3499,
      compareAtPrice: 4199,
      stock: 3,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Powder Blue", hex: "#BFE3F5" },
        { name: "Baby Pink", hex: "#FADCE8" },
        { name: "Butter Yellow", hex: "#FFF0B8" },
      ]),
      sizesJson: JSON.stringify(["S/M", "M/L", "XL"]),
      imagesJson: JSON.stringify([
        "/images/products/pastel-granny-square-cardigan-1.svg",
        "/images/products/pastel-granny-square-cardigan-2.svg",
        "/images/products/pastel-granny-square-cardigan-3.svg",
      ]),
      ratingAvg: 4.9,
      ratingCount: 1,
      popularity: 92,
      isFeatured: true,
      isSeasonal: false,
    },
    {
      slug: "sweetheart-memory-gift-hamper",
      name: "Sweetheart Memory Hamper",
      category: "Customized Gifts",
      description:
        "A keepsake pastel gift box curated with a mini crochet tulip, embroidered initials handkerchief, daisy keychain, and handwritten calligraphy card.",
      specifications:
        "Includes rigid pastel keepsake box • Satin ribbon • Custom initials tag included",
      price: 1999,
      compareAtPrice: 2399,
      stock: 9,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Powder Pink", hex: "#F7C6D9" },
        { name: "Soft Lavender", hex: "#E7DDF7" },
        { name: "Butter Yellow", hex: "#FFF0B8" },
      ]),
      sizesJson: JSON.stringify(["Classic Hamper", "Deluxe Hamper"]),
      imagesJson: JSON.stringify([
        "/images/products/sweetheart-memory-gift-hamper-1.svg",
        "/images/products/sweetheart-memory-gift-hamper-2.svg",
        "/images/products/sweetheart-memory-gift-hamper-3.svg",
      ]),
      ratingAvg: 5.0,
      ratingCount: 1,
      popularity: 89,
      isFeatured: false,
      isSeasonal: false,
    },
    {
      slug: "winter-candy-cane-ornament-box",
      name: "Winter Candy Ornament Box",
      category: "Seasonal Collections",
      description:
        "Limited seasonal box of 6 whimsical pastel ornaments: candy cane, frosted cupcake, mini mitten, star puff, snowflake, and gingerbread heart.",
      specifications:
        "Combed cotton & metallic gold thread accent • Hanging loops included • Box of 6",
      price: 1199,
      compareAtPrice: 1499,
      stock: 6,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Powder Blue", hex: "#BFE3F5" },
        { name: "Powder Pink", hex: "#F7C6D9" },
        { name: "Vanilla Cream", hex: "#FFF8ED" },
      ]),
      sizesJson: JSON.stringify(["Box of 6", "Box of 12"]),
      imagesJson: JSON.stringify([
        "/images/products/winter-candy-cane-ornament-box-1.svg",
        "/images/products/winter-candy-cane-ornament-box-2.svg",
        "/images/products/winter-candy-cane-ornament-box-3.svg",
      ]),
      ratingAvg: 4.9,
      ratingCount: 1,
      popularity: 87,
      isFeatured: false,
      isSeasonal: true,
    },
    {
      slug: "buttercup-sunflower-pot",
      name: "Buttercup Sunflower Pot",
      category: "Crochet Flowers & Bouquets",
      description:
        "A smiling potted crochet sunflower in a pastel terracotta-cream pot that sits happily on your study table or car dashboard.",
      specifications:
        "Height: 17 cm • Weighted beanbag pot base • Soft cotton petals",
      price: 899,
      compareAtPrice: 1099,
      stock: 11,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Butter Yellow", hex: "#FFF0B8" },
        { name: "Powder Pink", hex: "#F7C6D9" },
      ]),
      sizesJson: JSON.stringify(["Single Bloom", "Twin Blooms"]),
      imagesJson: JSON.stringify([
        "/images/products/buttercup-sunflower-pot-1.svg",
        "/images/products/buttercup-sunflower-pot-2.svg",
        "/images/products/buttercup-sunflower-pot-3.svg",
      ]),
      ratingAvg: 4.8,
      ratingCount: 1,
      popularity: 85,
      isFeatured: false,
      isSeasonal: false,
    },
    {
      slug: "macaron-pearl-crossbody-bag",
      name: "Macaron Pearl Crossbody",
      category: "Crochet Bags & Purses",
      description:
        "Round macaron-inspired sling purse stitched in soft lavender with a braided pearl-beaded strap and satin drawstring pouch inside.",
      specifications:
        "Diameter: 19 cm • Strap drop: 54 cm • Satin inner pouch",
      price: 1599,
      compareAtPrice: 1899,
      stock: 7,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Soft Lavender", hex: "#E7DDF7" },
        { name: "Powder Blue", hex: "#BFE3F5" },
        { name: "Powder Pink", hex: "#F7C6D9" },
      ]),
      sizesJson: JSON.stringify(["Mini Sling"]),
      imagesJson: JSON.stringify([
        "/images/products/macaron-pearl-crossbody-bag-1.svg",
        "/images/products/macaron-pearl-crossbody-bag-2.svg",
        "/images/products/macaron-pearl-crossbody-bag-3.svg",
      ]),
      ratingAvg: 4.9,
      ratingCount: 1,
      popularity: 88,
      isFeatured: true,
      isSeasonal: false,
    },
    {
      slug: "sleepy-bear-amigurumi",
      name: "Sleepy Bear Amigurumi",
      category: "Crochet Plushies & Toys",
      description:
        "A butter-cream sleepy bear wearing a pastel lavender nightcap and holding a tiny crochet star pillow.",
      specifications:
        "Height: 24 cm • Polyfill fiber stuffing • Safe for ages 3+",
      price: 1349,
      compareAtPrice: 1599,
      stock: 2,
      isOutOfStock: false,
      colorsJson: JSON.stringify([
        { name: "Butter Yellow", hex: "#FFF0B8" },
        { name: "Soft Lavender", hex: "#E7DDF7" },
      ]),
      sizesJson: JSON.stringify(["Standard (24 cm)"]),
      imagesJson: JSON.stringify([
        "/images/products/sleepy-bear-amigurumi-1.svg",
        "/images/products/sleepy-bear-amigurumi-2.svg",
        "/images/products/sleepy-bear-amigurumi-3.svg",
      ]),
      ratingAvg: 4.9,
      ratingCount: 1,
      popularity: 84,
      isFeatured: false,
      isSeasonal: false,
    },
  ];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });

    const existingReviews = await prisma.review.count({
      where: { productId: product.id },
    });
    if (existingReviews === 0) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: customer.id,
          authorName: "Ananya S.",
          rating: 5,
          comment:
            "The yarn is unbelievably soft and the pastel shades look straight out of a candy dream! Packaging had a handwritten card too.",
        },
      });
    }
  }

  // Seed 1 sample order, 1 pre-order, and 1 embroidery booking for Ananya
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: "SB-ORD-1001" },
  });
  if (!existingOrder) {
    await prisma.order.create({
      data: {
        orderNumber: "SB-ORD-1001",
        userId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        addressJson: JSON.stringify({
          fullName: "Ananya Sharma",
          phone: "+91 98201 55443",
          line1: "402 Roseberry Apartments, 14th Road, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
        }),
        itemsJson: JSON.stringify([
          {
            productId: "seed-1",
            slug: "cotton-candy-tulip-bouquet",
            name: "Cotton Candy Tulip Bouquet",
            price: 1299,
            quantity: 1,
            color: "Powder Pink",
            size: "5 Stems",
            image: "/images/products/cotton-candy-tulip-bouquet-1.svg",
          },
        ]),
        couponCode: "STITCH10",
        subtotal: 1299,
        discount: 130,
        shippingFee: 79,
        tax: 58,
        total: 1306,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        razorpayOrderId: "order_demo_1001",
        razorpayPaymentId: "pay_demo_1001",
        status: "Delivered",
        giftWrap: true,
        giftNote: "Happy Birthday Tia! Loops of love.",
      },
    });
  }

  const existingPreOrder = await prisma.crochetPreOrder.findUnique({
    where: { preOrderNumber: "SB-PRE-2041" },
  });
  if (!existingPreOrder) {
    await prisma.crochetPreOrder.create({
      data: {
        preOrderNumber: "SB-PRE-2041",
        userId: customer.id,
        productType: "Crochet Cardigan",
        selectedColorsJson: JSON.stringify([
          { name: "Powder Blue", hex: "#BFE3F5" },
          { name: "Powder Pink", hex: "#F7C6D9" },
          { name: "Vanilla Cream", hex: "#FFF8ED" },
        ]),
        size: "M/L",
        designVariation: "Daisy Granny Squares with Scallop Hem",
        personalizedText: "Ananya",
        specialInstructions: "Please make sleeves slightly puffy.",
        quantity: 1,
        requiredDeliveryDate: "2026-12-18",
        timelinePreference: "Standard (10-14 days)",
        estimatedPrice: 3699,
        quotedPrice: 3699,
        advanceAmount: 1500,
        paymentStatus: "Advance Paid",
        status: "In Production",
        expectedDeliveryDate: "2026-12-15",
        deliveryAddressJson: JSON.stringify({
          line1: "402 Roseberry Apartments, Bandra West",
          city: "Mumbai",
          pincode: "400050",
        }),
        contactName: "Ananya Sharma",
        contactPhone: "+91 98201 55443",
        contactEmail: "ananya@stitchberry.in",
        adminNotes: "Yarn dyed & matched. Crocheting sleeve panels now!",
      },
    });
  }

  const existingEmbroidery = await prisma.embroideryBooking.findUnique({
    where: { bookingNumber: "SB-EMB-3012" },
  });
  if (!existingEmbroidery) {
    await prisma.embroideryBooking.create({
      data: {
        bookingNumber: "SB-EMB-3012",
        userId: customer.id,
        garmentType: "Jackets",
        garmentImageUrl: "/images/gallery/floral-denim-jacket.svg",
        referenceDesignUrl: "/images/gallery/pastel-kurti-collar.svg",
        placement: "Back Panel",
        threadColorsJson: JSON.stringify([
          { name: "Powder Pink", hex: "#F7C6D9" },
          { name: "Powder Blue", hex: "#BFE3F5" },
          { name: "Butter Yellow", hex: "#FFF0B8" },
        ]),
        designSize: "Large Showcase (9–12 in)",
        embroideryType: "Floral Hand Embroidery",
        personalizedText: "Bloom Wildly",
        additionalInstructions: "Light denim jacket, please keep stitches tight.",
        customerName: "Ananya Sharma",
        mobileNumber: "+91 98201 55443",
        customerEmail: "ananya@stitchberry.in",
        pickupAddress: "402 Roseberry Apartments, 14th Road, Bandra West, Mumbai",
        pincode: "400050",
        preferredPickupDate: "2026-12-01",
        preferredPickupSlot: "Morning (9:00 AM – 12:00 PM)",
        estimatedPrice: 1650,
        confirmedPrice: 1650,
        pickupCharge: 99,
        deliveryCharge: 99,
        estimatedCompletionDays: 10,
        status: "Embroidery started",
        pickupPersonName: "Rohan Verma (StitchBerry Courier)",
        pickupPersonPhone: "+91 98111 22334",
        pickupScheduledAt: "2026-12-01 10:30 AM",
        garmentConditionNotes:
          "Inspected on arrival: Light blue denim jacket in clean condition, all buttons intact, no pre-existing tears.",
        garmentConditionPhotosJson: JSON.stringify([
          "/images/gallery/floral-denim-jacket.svg",
        ]),
        completedWorkPhotosJson: JSON.stringify([]),
        paymentStatus: "50% Advance Paid",
      },
    });
  }

  // Seed saved color palette & notifications
  const savedCount = await prisma.savedDesign.count({
    where: { userId: customer.id },
  });
  if (savedCount === 0) {
    await prisma.savedDesign.create({
      data: {
        userId: customer.id,
        title: "Cotton Candy Sorbet Mix",
        designType: "Yarn Palette",
        colorsJson: JSON.stringify([
          { name: "Powder Blue", hex: "#BFE3F5" },
          { name: "Powder Pink", hex: "#F7C6D9" },
          { name: "Butter Yellow", hex: "#FFF0B8" },
          { name: "Vanilla Cream", hex: "#FFF8ED" },
        ]),
        notes: "Perfect for spring cardigan squares",
      },
    });

    await prisma.notification.createMany({
      data: [
        {
          userId: customer.id,
          title: "Embroidery Started on Your Denim Jacket",
          message:
            "Our artisan Kavita has started stitching your pastel wildflower design (SB-EMB-3012). Garment inspection photo is uploaded in your dashboard.",
          type: "EMBROIDERY",
          link: "/account",
        },
        {
          userId: customer.id,
          title: "Pre-Order Yarn Ready!",
          message:
            "Your custom Pastel Cardigan (SB-PRE-2041) is now In Production.",
          type: "PREORDER",
          link: "/account",
        },
      ],
    });
  }

  console.log("Seed complete! Admin: admin@stitchberry.in / admin123 | Customer: ananya@stitchberry.in / pastel123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
