import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Layers, Ruler } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface UserInputFormProps {
  onFormSubmit: (data: FormData) => void;
}

interface FormData {
  state: string;
  district: string;
  season: string;
  soilType: string;
  farmSize: string;
  farmUnit: string;
}

export const UserInputForm = ({ onFormSubmit }: UserInputFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    state: "",
    district: "",
    season: "",
    soilType: "",
    farmSize: "",
    farmUnit: "acre"
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const soilTypes = [
    "Black Soil (Regur)", "Red Soil", "Alluvial Soil", "Sandy Soil", 
    "Clayey Soil", "Laterite Soil", "Mountain Soil", "Saline Soil"
  ];

  const seasons = [
    { value: "Kharif", label: t("season.kharif") },
    { value: "Rabi", label: t("season.rabi") },
    { value: "Zaid", label: t("season.zaid") }
  ];

  // Comprehensive State-based districts mapping with accurate data
  const stateDistricts: { [key: string]: string[] } = {
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Erode", "Namakkal", "Krishnagiri", "Dharmapuri", "Karur", "Pudukkottai", "Ramanathapuram", "Sivaganga", "Virudhunagar", "Theni", "Nilgiris", "Kanchipuram", "Tiruvallur", "Cuddalore", "Villupuram", "Nagapattinam", "Mayiladuthurai", "Ariyalur", "Perambalur", "Kallakurichi", "Chengalpattu", "Tenkasi", "Tirupathur", "Ranipet"],
    "Karnataka": ["Bangalore Urban", "Bangalore Rural", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga", "Tumkur", "Mandya", "Hassan", "Chitradurga", "Kolar", "Chikmagalur", "Udupi", "Uttara Kannada", "Dakshina Kannada", "Kodagu", "Chamarajanagar", "Raichur", "Koppal", "Gadag", "Bagalkot", "Haveri", "Chikballapur", "Yadgir", "Vijayanagara"],
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
    "Telangana": ["Hyderabad", "Rangareddy", "Medchal-Malkajgiri", "Sangareddy", "Vikarabad", "Mahabubnagar", "Nagarkurnool", "Wanaparthy", "Narayanpet", "Jogulamba Gadwal", "Nalgonda", "Suryapet", "Yadadri Bhuvanagiri", "Jangaon", "Warangal Rural", "Warangal Urban", "Hanamkonda", "Mulugu", "Bhupalpally", "Jayashankar Bhoopalpally", "Karimnagar", "Peddapalli", "Jagitial", "Rajanna Sircilla", "Kamareddy", "Nizamabad", "Nirmal", "Mancherial", "Komaram Bheem", "Adilabad", "Asifabad", "Bhadradri Kothagudem", "Khammam", "Mahabubabad"],
    "Kerala": ["Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"],
    "Maharashtra": ["Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg", "Nashik", "Dhule", "Nandurbar", "Jalgaon", "Ahmednagar", "Pune", "Solapur", "Satara", "Sangli", "Kolhapur", "Aurangabad", "Jalna", "Beed", "Latur", "Osmanabad", "Nanded", "Hingoli", "Parbhani", "Nagpur", "Wardha", "Amravati", "Yavatmal", "Akola", "Washim", "Buldhana", "Bhandara", "Gondia", "Chandrapur", "Gadchiroli"],
    "Punjab": ["Amritsar", "Gurdaspur", "Pathankot", "Batala", "Tarn Taran", "Kapurthala", "Jalandhar", "Shaheed Bhagat Singh Nagar", "Hoshiarpur", "Rupnagar", "Mohali", "Ludhiana", "Firozpur", "Faridkot", "Muktsar", "Bathinda", "Mansa", "Sangrur", "Barnala", "Patiala", "Fatehgarh Sahib", "Malerkotla"],
    "Haryana": ["Gurugram", "Faridabad", "Palwal", "Nuh", "Mahendragarh", "Rewari", "Jhajjar", "Rohtak", "Bhiwani", "Charkhi Dadri", "Hisar", "Jind", "Fatehabad", "Sirsa", "Panipat", "Karnal", "Kaithal", "Kurukshetra", "Yamunanagar", "Ambala", "Panchkula", "Sonipat"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
    "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khorda", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
    "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribag", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
    "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela Pendra Marwahi", "Janjgir Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
    "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.state && formData.district && formData.season && formData.soilType && formData.farmSize) {
      onFormSubmit(formData);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-crop">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          {t("form.title")}
        </CardTitle>
        <CardDescription>
          {t("form.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {t("form.state")}
              </Label>
              <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t("form.district")}</Label>
              <Select value={formData.district} onValueChange={(value) => updateFormData("district", value)} disabled={!formData.state}>
                <SelectTrigger>
                  <SelectValue placeholder={formData.state ? "Select your district" : "Select state first"} />
                </SelectTrigger>
                <SelectContent>
                  {formData.state && stateDistricts[formData.state]?.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t("form.season")}
            </Label>
            <Select value={formData.season} onValueChange={(value) => updateFormData("season", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cropping season" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soilType" className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              {t("form.soil-type")}
            </Label>
            <Select value={formData.soilType} onValueChange={(value) => updateFormData("soilType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your soil type" />
              </SelectTrigger>
              <SelectContent>
                {soilTypes.map((soil) => (
                  <SelectItem key={soil} value={soil}>
                    {soil}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Farm Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              {t("form.farm-size")}
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter size"
                value={formData.farmSize}
                onChange={(e) => updateFormData("farmSize", e.target.value)}
                className="flex-1"
                type="number"
                min="0"
                step="0.1"
              />
              <Select value={formData.farmUnit} onValueChange={(value) => updateFormData("farmUnit", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="hectare">Hectare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="nav" 
            size="lg" 
            className="w-full"
            disabled={!formData.state || !formData.district || !formData.season || !formData.soilType || !formData.farmSize}
          >
            {t("form.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};