# Frontend-Backend API Mapping Guide

## ✅ Frontend API Structure (Fixed)

The frontend API has been updated to match the new backend module structure.

---

## 📁 Frontend API Files → Backend Modules

### **1. Auth API**
**Frontend File:** `src/store/api/authApi.ts`  
**Backend Module:** `src/modules/auth/`  
**Base Route:** `/api/v1/auth`

| Endpoint | Method | Backend Controller |
|----------|--------|-------------------|
| `/auth/login` | POST | `AuthController.login()` |
| `/auth/register` | POST | `AuthController.register()` |
| `/auth/profile` | GET | `AuthController.getProfile()` |

---

### **2. Jobs API**
**Frontend File:** `src/store/api/jobsApi.ts`  
**Backend Module:** `src/modules/jobs/`  
**Base Route:** `/api/v1/master/jobs`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetJobsQuery()` | `GET /master/jobs` | `JobsController.list()` |
| `useGetJobByIdQuery(id)` | `GET /master/jobs/:id` | `JobsController.getById()` |
| `useCreateJobMutation()` | `POST /master/jobs` | `JobsController.create()` |
| `useUpdateJobMutation()` | `PATCH /master/jobs/:id` | `JobsController.update()` |
| `useDeleteJobMutation()` | `DELETE /master/jobs/:id` | `JobsController.delete()` |

**Service:** `JobsService` (`src/modules/jobs/jobs.service.ts`)

---

### **3. House AWBs API**
**Frontend File:** `src/store/api/houseAwbsApi.ts`  
**Backend Module:** `src/modules/house-awbs/`  
**Base Route:** `/api/v1/master/house-awbs`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetHouseAwbsQuery()` | `GET /master/house-awbs` | `HouseAwbsController.list()` |
| `useSearchHouseAwbsQuery()` | `GET /master/house-awbs/search` | `HouseAwbsController.search()` |
| `useGetHouseAwbByIdQuery(id)` | `GET /master/house-awbs/:id` | `HouseAwbsController.getById()` |
| `useCreateHouseAwbMutation()` | `POST /master/house-awbs` ✅ FIXED | `HouseAwbsController.create()` |
| `useUpdateHouseAwbMutation()` | `PUT /master/house-awbs/:id` | `HouseAwbsController.update()` |
| `useDeleteHouseAwbMutation()` | `DELETE /master/house-awbs/:id` | `HouseAwbsController.delete()` |

**Service:** `HouseAwbsService` (`src/modules/house-awbs/house-awbs.service.ts`)

**What Was Fixed:**
- ❌ Old: `POST /master/jobs/house-awb`
- ✅ New: `POST /master/house-awbs`

---

### **4. Master AWBs API**
**Frontend File:** `src/store/api/masterAwbsApi.ts`  
**Backend Module:** `src/modules/master-awbs/`  
**Base Route:** `/api/v1/master/master-awbs`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetMasterAwbsQuery()` | `GET /master/master-awbs` | `MasterAwbsController.list()` |
| `useSearchMasterAwbsQuery()` | `GET /master/master-awbs/search` | `MasterAwbsController.search()` |
| `useGetMasterAwbByIdQuery(id)` | `GET /master/master-awbs/:id` | `MasterAwbsController.getById()` |
| `useCreateMasterAwbMutation()` | `POST /master/master-awbs` | `MasterAwbsController.create()` |
| `useUpdateMasterAwbMutation()` | `PUT /master/master-awbs/:id` | `MasterAwbsController.update()` |
| `useDeleteMasterAwbMutation()` | `DELETE /master/master-awbs/:id` | `MasterAwbsController.delete()` |

**Service:** `MasterAwbsService` (`src/modules/master-awbs/master-awbs.service.ts`)

---

### **5. Master Data API**
**Frontend File:** `src/store/api/masterDataApi.ts`  
**Backend Modules:** Multiple modules in `src/modules/`

#### **Countries**
**Backend Module:** `src/modules/countries/`  
**Base Route:** `/api/v1/master/countries`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetCountriesQuery()` | `GET /master/countries` | `CountriesController.list()` |
| `useSearchCountriesQuery()` | `GET /master/countries/search` | `CountriesController.search()` |
| `useGetCountryByIdQuery(id)` | `GET /master/countries/:id` | `CountriesController.getById()` |
| `useCreateCountryMutation()` | `POST /master/countries` | `CountriesController.create()` |

#### **Cities**
**Backend Module:** `src/modules/cities/`  
**Base Route:** `/api/v1/master/cities`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetCitiesQuery()` | `GET /master/cities` | `CitiesController.list()` |
| `useSearchCitiesQuery()` | `GET /master/cities/search` | `CitiesController.search()` |
| `useGetCityByIdQuery(id)` | `GET /master/cities/:id` | `CitiesController.getById()` |
| `useCreateCityMutation()` | `POST /master/cities` | `CitiesController.create()` |

#### **Ports/Airports**
**Backend Module:** `src/modules/ports-airports/`  
**Base Route:** `/api/v1/master/ports-airports`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetPortsAirportsQuery()` | `GET /master/ports-airports` | `PortsAirportsController.list()` |
| `useSearchPortsAirportsQuery()` | `GET /master/ports-airports/search` | `PortsAirportsController.search()` |
| `useGetPortAirportByIdQuery(id)` | `GET /master/ports-airports/:id` | `PortsAirportsController.getById()` |
| `useCreatePortAirportMutation()` | `POST /master/ports-airports` | `PortsAirportsController.create()` |

#### **Carriers**
**Backend Module:** `src/modules/carriers/`  
**Base Route:** `/api/v1/master/carriers`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetCarriersQuery()` | `GET /master/carriers` | `CarriersController.list()` |
| `useSearchCarriersQuery()` | `GET /master/carriers/search` | `CarriersController.search()` |
| `useGetCarrierByIdQuery(id)` | `GET /master/carriers/:id` | `CarriersController.getById()` |
| `useCreateCarrierMutation()` | `POST /master/carriers` | `CarriersController.create()` |

#### **Commodities**
**Backend Module:** `src/modules/commodities/`  
**Base Route:** `/api/v1/master/commodities`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetCommoditiesQuery()` | `GET /master/commodities` | `CommoditiesController.list()` |
| `useSearchCommoditiesQuery()` | `GET /master/commodities/search` | `CommoditiesController.search()` |
| `useGetCommodityByIdQuery(id)` | `GET /master/commodities/:id` | `CommoditiesController.getById()` |
| `useCreateCommodityMutation()` | `POST /master/commodities` | `CommoditiesController.create()` |

#### **Parties**
**Backend Module:** `src/modules/parties/`  
**Base Route:** `/api/v1/master/parties`

| Frontend Hook | Endpoint | Backend Controller |
|--------------|----------|-------------------|
| `useGetPartiesQuery()` | `GET /master/parties` | `PartiesController.list()` |
| `useSearchPartiesQuery()` | `GET /master/parties/search` | `PartiesController.search()` |
| `useGetPartyByIdQuery(id)` | `GET /master/parties/:id` | `PartiesController.getById()` |
| `useCreatePartyMutation()` | `POST /master/parties` | `PartiesController.create()` |

---

## 📦 Additional Backend Modules (Need Frontend APIs)

These backend modules exist but don't have dedicated frontend API files yet:

### **Items**
**Backend Module:** `src/modules/items/`  
**Base Route:** `/api/v1/master/items`  
**Status:** ⚠️ Currently accessed through House AWBs

### **Cost Centers**
**Backend Module:** `src/modules/cost-centers/`  
**Base Route:** `/api/v1/master/cost-centers`  
**Status:** ⚠️ Need to create frontend API file

### **Financial Transactions**
**Backend Module:** `src/modules/financial-transactions/`  
**Base Route:** `/api/v1/master/financial-transactions`  
**Status:** ⚠️ Need to create frontend API file

---

## 🔄 Response Format (Consistent)

Thanks to the backend interceptor, ALL endpoints now return:

### **Success Response**
```typescript
{
  success: true,
  message: "Operation completed successfully",
  data: {
    // Your actual data here
  }
}
```

### **Error Response**
```typescript
{
  success: false,
  message: "Error description",
  errors: [
    "Specific error 1",
    "Specific error 2"
  ]
}
```

### **Paginated Response**
```typescript
{
  success: true,
  message: "Success",
  data: {
    data: [ /* array of items */ ],
    total: 100,
    page: 1,
    page_size: 10,
    total_pages: 10,
    totalPages: 10, // Alias
    limit: 10       // Alias
  }
}
```

---

## 💻 Usage Examples

### **Fetching Data**
```typescript
import { useGetJobsQuery } from '@/store/api/jobsApi';

function JobsList() {
  const { data, isLoading, error } = useGetJobsQuery({ 
    page: 1, 
    limit: 10 
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Access data consistently
  const jobs = data?.data?.data || [];
  
  return (
    <div>
      {jobs.map(job => (
        <div key={job.job_id}>{job.job_number}</div>
      ))}
    </div>
  );
}
```

### **Creating Data**
```typescript
import { useCreateJobMutation } from '@/store/api/jobsApi';

function CreateJob() {
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleSubmit = async (formData) => {
    try {
      const response = await createJob(formData).unwrap();
      
      if (response.success) {
        toast.success(response.message);
        // Access created job
        const newJob = response.data;
      }
    } catch (error) {
      // Error handling with specific messages
      if (error.data?.errors) {
        error.data.errors.forEach(err => {
          toast.error(err);
        });
      } else {
        toast.error(error.data?.message || 'An error occurred');
      }
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### **Searching Data**
```typescript
import { useSearchCountriesQuery } from '@/store/api/masterDataApi';

function CountrySearch() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data } = useSearchCountriesQuery({
    country_name: searchTerm,
    page: 1,
    page_size: 20
  });

  const countries = data?.data?.data || [];

  return (
    <div>
      <input 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      {countries.map(country => (
        <div key={country.country_id}>{country.country_name}</div>
      ))}
    </div>
  );
}
```

---

## 🎯 Store Configuration

All APIs are registered in `src/store/index.ts`:

```typescript
export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [masterDataApi.reducerPath]: masterDataApi.reducer,
    [jobsApi.reducerPath]: jobsApi.reducer,
    [houseAwbsApi.reducerPath]: houseAwbsApi.reducer,
    [masterAwbsApi.reducerPath]: masterAwbsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(toastMiddleware)
      .concat(authApi.middleware)
      .concat(masterDataApi.middleware)
      .concat(jobsApi.middleware)
      .concat(houseAwbsApi.middleware)
      .concat(masterAwbsApi.middleware),
});
```

---

## ✅ What Was Fixed

### **Issue:** MasterDataApi not getting data

**Root Cause:** 
1. ✅ House AWBs create endpoint was using wrong URL (`/master/jobs/house-awb` → `/master/house-awbs`)
2. ✅ All other endpoints were already correct

**What Changed:**
```typescript
// BEFORE
createHouseAwb: builder.mutation({
  query: (data) => ({
    url: '/master/jobs/house-awb', // ❌ WRONG
    method: 'POST',
    body: data,
  }),
}),

// AFTER
createHouseAwb: builder.mutation({
  query: (data) => ({
    url: '/master/house-awbs', // ✅ CORRECT
    method: 'POST',
    body: data,
  }),
}),
```

---

## 🚀 Testing

### **Test All Endpoints**
```bash
# Start backend
cd logistics-backend
npm run start:dev

# Start frontend
cd logistics-frontend
npm run dev
```

### **Verify Endpoints**
1. **Jobs:** Create a new job → Check `/master/jobs` endpoint
2. **House AWBs:** Create a house AWB → Check `/master/house-awbs` endpoint
3. **Master Data:** View countries, cities, etc. → All should work
4. **Error Handling:** Try creating duplicate → See specific error message

---

## 📚 Quick Reference

| Domain | Frontend File | Backend Module | Base Route |
|--------|---------------|----------------|------------|
| Auth | `authApi.ts` | `auth/` | `/auth` |
| Jobs | `jobsApi.ts` | `jobs/` | `/master/jobs` |
| House AWBs | `houseAwbsApi.ts` | `house-awbs/` | `/master/house-awbs` |
| Master AWBs | `masterAwbsApi.ts` | `master-awbs/` | `/master/master-awbs` |
| Countries | `masterDataApi.ts` | `countries/` | `/master/countries` |
| Cities | `masterDataApi.ts` | `cities/` | `/master/cities` |
| Ports/Airports | `masterDataApi.ts` | `ports-airports/` | `/master/ports-airports` |
| Carriers | `masterDataApi.ts` | `carriers/` | `/master/carriers` |
| Commodities | `masterDataApi.ts` | `commodities/` | `/master/commodities` |
| Parties | `masterDataApi.ts` | `parties/` | `/master/parties` |

---

**Status:** ✅ All Fixed  
**Version:** 2.0.0  
**Last Updated:** 2024-10-23

