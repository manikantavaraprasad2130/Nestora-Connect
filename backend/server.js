const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "mangobd";
const COLLECTION_NAME = "properties";
const VISITS_COLLECTION = "visits";

const uploadDirectory = path.join(__dirname, "uploads");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDirectory));
app.use(express.static(path.join(__dirname, "..", "frontend")));

const client = new MongoClient(MONGO_URI);
let propertiesCollection;
let usersCollection;
let visitsCollection;
const USER_COLLECTION = "users";

async function initDb() {
  await client.connect();
  const db = client.db(DB_NAME);
  propertiesCollection = db.collection(COLLECTION_NAME);
  usersCollection = db.collection(USER_COLLECTION);
  visitsCollection = db.collection(VISITS_COLLECTION);
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.post("/login.html", (_req, res) => {
  res.redirect("/properties.html");
});

app.post("/register.html", (_req, res) => {
  res.redirect("/login.html");
});

app.post("/api/register", async (req, res) => {
  const fullName = req.body["full-name"];
  const email = req.body.email;
  const mobile = req.body.mobile;
  const password = req.body.password;
  const confirmPassword = req.body["confirm-password"];
  const userType = req.body["user-type"] || "customer";

  if (!fullName || !email || !mobile || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please complete all registration fields." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "A user with that email already exists." });
    }

    const user = {
      fullName,
      email,
      mobile,
      password,
      userType,
      createdAt: new Date().toISOString()
    };

    const result = await usersCollection.insertOne(user);
    user._id = result.insertedId;

    return res.status(201).json({ message: "User registered successfully.", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to register user." });
  }
});

app.post("/api/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const loginType = req.body["login-type"] || "customer";

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await usersCollection.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    if (user.userType !== loginType) {
      return res.status(403).json({ message: "User type does not match login type." });
    }

    return res.json({ message: "Login successful.", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to log in." });
  }
});

app.get("/api/users", async (_req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to read users." });
  }
});

app.get("/api/properties", async (_req, res) => {
  try {
    const properties = await propertiesCollection.find({}).toArray();
    const serialized = properties.map((property) => ({
      ...property,
      _id: property._id.toString()
    }));
    return res.json(serialized);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to read properties." });
  }
});

app.get("/api/properties/:id", async (req, res) => {
  const propertyId = req.params.id;
  if (!ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID." });
  }

  try {
    const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }
    return res.json({ ...property, _id: property._id.toString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to read property." });
  }
});

app.post(
  "/api/properties",
  upload.fields([
    { name: "house-images", maxCount: 10 },
    { name: "images", maxCount: 10 }
  ]),
  async (req, res) => {
    const propertyName = req.body["property-name"];
    const location = req.body.location;
    const state = req.body.state;
    const pincode = req.body.pincode;
    const district = req.body.district;
    const city = req.body.city;
    const village = req.body.village;
    const houseNumber = req.body["house-number"];
    const street = req.body.street;
    const propertyType = req.body["property-type"];
    const rentPrice = req.body["rent-price"];
    const ownerName = req.body["owner-name"] || req.body.ownerName;
    const phoneNumber = req.body["phone-number"] || req.body.phoneNumber;
    const email = req.body.email;
    const bedrooms = req.body.bedrooms;
    const bathrooms = req.body.bathrooms;
    const description = req.body.description;

    if (!propertyName || !location || !state || !pincode || !district || !city || !houseNumber || !street || !propertyType || !rentPrice) {
      return res.status(400).json({ message: "Please complete all required property address and listing fields." });
    }

    try {
      const filesByField = req.files || {};
      const uploadedFiles = [
        ...(filesByField["house-images"] || []),
        ...(filesByField.images || [])
      ];
      const uploadedImages = uploadedFiles.map((file) => `/uploads/${file.filename}`);

      const property = {
        propertyName,
        location,
        state,
        pincode,
        district,
        city,
        village,
        houseNumber,
        street,
        propertyType,
        rentPrice,
        ownerName,
        phoneNumber,
        email,
        bedrooms,
        bathrooms,
        description,
        images: uploadedImages,
        createdAt: new Date().toISOString()
      };

      const result = await propertiesCollection.insertOne(property);
      property._id = result.insertedId.toString();

      return res.status(201).json({ message: "Property created.", property });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to save property." });
    }
  }
);

app.put("/api/properties/:id", async (req, res) => {
  const propertyId = req.params.id;
  if (!ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID." });
  }

  const updates = {};
  const allowedFields = ["propertyName", "location", "state", "pincode", "district", "city", "village", "houseNumber", "street", "propertyType", "rentPrice", "ownerName", "phoneNumber", "email", "bedrooms", "bathrooms", "description"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update." });
  }

  try {
    const result = await propertiesCollection.findOneAndUpdate(
      { _id: new ObjectId(propertyId) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Property not found." });
    }

    const updatedProperty = {
      ...result.value,
      _id: result.value._id.toString()
    };
    return res.json({ message: "Property updated.", property: updatedProperty });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update property." });
  }
});

app.delete("/api/properties/:id", async (req, res) => {
  const propertyId = req.params.id;
  if (!ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID." });
  }

  try {
    const result = await propertiesCollection.deleteOne({ _id: new ObjectId(propertyId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Property not found." });
    }

    return res.json({ message: "Property deleted." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete property." });
  }
});

app.post("/api/visits", async (req, res) => {
  const { propertyId, visitorName, visitorMobile, visitDate } = req.body;

  if (!propertyId || !visitorName || !visitorMobile || !visitDate) {
    return res.status(400).json({ message: "Please complete all visit request fields." });
  }

  if (!ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID." });
  }

  try {
    const visit = {
      propertyId: new ObjectId(propertyId),
      visitorName,
      visitorMobile,
      visitDate,
      createdAt: new Date().toISOString()
    };

    const result = await visitsCollection.insertOne(visit);
    return res.status(201).json({
      message: "Visit request created.",
      visit: {
        ...visit,
        _id: result.insertedId.toString(),
        propertyId: propertyId
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to save visit request." });
  }
});

app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
});

async function start() {
  try {
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    await initDb();
    app.listen(PORT, () => {
      console.log(`Nestora Connect backend running at http://localhost:${PORT}`);
      console.log(`Connected to MongoDB at ${MONGO_URI}/${DB_NAME}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

