const { AxiosGet, AxiosPost } = require("./services/useAxios");
// const zlib = require("zlib");

exports.getAirports = (base_url, token) => {
  return AxiosGet(base_url + "/api/flight/airports", {
    "Content-Type": "application/json",
    "accept-encoding": "gzip,deflate",
    Authorization: `Bearer ${token}`,
  }).then((response) => {
    return response.data;

    // zlib.gunzip(response.data, (err, unzipped) => {
    //   console.log(unzipped, err); //.toString());
    // })
  });
};
exports.flightSearch = (
  base_url,
  token,
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
) => {
  const itineraries = [
    {
      Departure: from,
      Destination: to,
      DepartureDate: departureDate,
    },
  ];
  returnDate && (searchType === "Multidestination" || searchType === "Return")
    ? itineraries.push({
        Departure: to,
        Destination: from,
        DepartureDate: returnDate,
      })
    : "";
  const payload = {
    FlightSearchType: searchType,
    Adults: adultsCount,
    Children: childrenCount,
    Infants: infantCount,
    Ticketclass: ticketclass,
    TargetCurrency: currency,
    Itineraries: itineraries,
  };
  return AxiosPost(base_url + "/api/flight/search", payload, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
    .then((response) => {
      // console.log(response);
      return response.data;
    })
    .catch((err) => console.log(err));
};

exports.flightSelect = (base_url, token, currency, selectData) => {
  payload = {
    TargetCurrency: currency,
    SelectData: selectData,
  };
  return AxiosPost(base_url + "/api/flight/select", payload, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
    .then((response) => {
      return response.data;
      // console.log(response.data);
    })
    .catch((err) => console.log(err));
};

exports.flightBooking = (
  base_url,
  token,
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
) => {
  payload = {
    BookingData: BookingData,
    BookingId: BookingId,
    PassengerType: PassengerType,
    FirstName: FirstName,
    MiddleName: MiddleName,
    LastName: LastName,
    DateOfBirth: DateOfBirth,
    PhoneNumber: PhoneNumber,
    PassportNumber: PassportNumber,
    ExpiryDate: ExpiryDate,
    PassportIssuingAuthority: PassportIssuingAuthority,
    Gender: Gender,
    Title: Title,
    Email: Email,
    Address: Address,
    Country: Country,
    CountryCode: CountryCode,
    City: City,
    PostalCode: PostalCode,
    TargetCurrency: TargetCurrency,
    ProductType: "Flight",
  };

  return AxiosPost(base_url + "/api/flight/book", payload, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
    .then((response) => {
      return response.data;
      // console.log(response.data);
      // })
    })
    .catch((err) => console.log(err));
};

exports.flightTicketPnr = (base_url, token, bookingId, PnrNumber) => {
  //Ticket PNR after payment has been confirmed.
  payload = {
    BookingId: bookingId,
    PnrNumber: PnrNumber,
  };
  return AxiosPost(base_url + "/api/flight/ticketpnr", payload, {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  })
    .then((response) => {
      return response.data;
      // console.log(response.data);
    })
    .catch((err) => console.log(err));
};
