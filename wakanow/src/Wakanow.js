const {
  getAirports,
  flightSearch,
  flightSelect,
  flightBooking,
  flightTicketPnr,
} = require("./api_requests");
const { generateToken } = require("./Authenticate");

class Wakanow {
  expire_time = null;
  access_token = null;
  constructor(base_url, username, passwrd, grant_type) {
    this.baseUrl = base_url;
    this.username = username;
    this.password = passwrd;
    this.grantType = grant_type;
    this.authenticate();
  }

  //-----------Auth methods----------
  async authenticate() {
    // console.log("\n\n\nIn auth\n\n\n ");
    let authed = false;
    if (this.expire_time) {
      const currentTime = new Date().getTime();
      if (currentTime < this.expire_time - 15000) {
        console.log("\n\n\nAbout to auth1\n\n\n ");
        authed = true;
      }
    }
    if (!authed) {
      console.log("\n\n\nAbout to auth\n\n\n ");
      return this._generateToken().then((res) => {
        this.access_token = res.token;
        this.expire_time = res.end_date;
        authed = true;
        return res;
      });
    }
    return authed;
  }
  _generateToken() {
    return generateToken(
      this.baseUrl,
      this.grantType,
      this.username,
      this.password
    ).then((a) => {
      //   console.log(a);
      try {
        return {
          token: a.access_token,
          end_seconds: a.expires_in,
          end_date: new Date(a[".expires"]).getTime(),
          issue_date: new Date(a[".issued"]).getTime(),
        };
      } catch (error) {
        return error;
      }
      {
        return {
          token: a.access_token,
          end_seconds: a.expires_in,
          end_date: new Date(a[".expires"]).getTime(),
          issue_date: new Date(a[".issued"]).getTime(),
        };
      }
    });
  }

  //-----------Request methods----------
  async getAirports() {
    await this.authenticate();
    // console.log("logggingg", this.baseUrl, this.access_token);
    return getAirports(this.baseUrl, this.access_token);
  }

  async flightSearch(
    searchType,
    adultsCount,
    childrenCount,
    infantCount,
    from,
    to,
    departureDate,
    returnDate,
    currency,
    ticketclass
  ) {
    //     "FlightSearchType": "string";{"Oneway","Multidestination"}
    //     "Ticketclass": "string";{"Y"}
    //     "Adults": “int”,
    //     "Children": “int”,
    //     "Infants": “int”,
    //     "Itineraries": [
    //     {
    //     "Departure": "string",
    //     "Destination": "string",
    //     "DepartureDate": "Date-MM/dd/yyyy"
    //     }
    //     ],
    //     "TargetCurrency": "string"
    //     }

    await this.authenticate();
    return flightSearch(
      this.baseUrl,
      this.access_token,
      searchType,
      adultsCount,
      childrenCount,
      infantCount,
      from,
      to,
      departureDate,
      returnDate,
      currency,
      ticketclass
    );
  }

  async flightSelect(currency, selectData) {
    await this.authenticate();
    return flightSelect(this.baseUrl, this.access_token, currency, selectData);
  }

  async flightBooking(
    BookingData,
    BookingId,
    PassengerType,
    FirstName,
    MiddleName,
    LastName,
    DateOfBirth,
    PhoneNumber,
    PassportNumber,
    ExpiryDate,
    PassportIssuingAuthority,
    Gender,
    Title,
    Email,
    Address,
    Country,
    CountryCode,
    City,
    PostalCode,
    TargetCurrency
  ) {
    await this.authenticate();
    return flightBooking(
      this.baseUrl,
      this.access_token,
      BookingData,
      BookingId,
      PassengerType,
      FirstName,
      MiddleName,
      LastName,
      DateOfBirth,
      PhoneNumber,
      PassportNumber,
      ExpiryDate,
      PassportIssuingAuthority,
      Gender,
      Title,
      Email,
      Address,
      Country,
      CountryCode,
      City,
      PostalCode,
      TargetCurrency
    );
  }

  async flightTicketPnr(bookingId, PnrNumber) {
    await this.authenticate();
    return flightTicketPnr(
      this.baseUrl,
      this.access_token,
      bookingId,
      PnrNumber
    );
  }
}

module.exports.Wakanow = Wakanow;
