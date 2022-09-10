const { wakanow, airportsList } = require("../wakanow"); //wakanow.airportsList;
//--------------Flight---------

exports.flightAirportsList = async (req, res) => {
  try {
    return res.status(200).send(airportsList);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.flightSearch = async (req, res) => {
  try {
    const {
      searchType,
      adultsCount,
      childrenCount,
      infantCount,
      from,
      to,
      departureDate,
      returnDate,
      currency,
      ticketclass,
    } = req.body;
    const flightSearchResult = await wakanow.flightSearch(
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
    return res.status(200).send({
      flightSearchResult,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.flightSelect = async (req, res) => {
  try {
    const { currency, selectData } = req.body;
    const flightSelectResponse = await wakanow.flightSelect(
      currency,
      selectData
    );
    return res.status(200).send({
      flightSelectResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
exports.flightBook = async (req, res) => {
  try {
    const {
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
      TargetCurrency,
    } = req.body;
    const flightBookResponse = await wakanow.flightBooking(
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
    return res.status(200).send({
      flightBookResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.flightTicketpnr = async (req, res) => {
  try {
    const { bookingId, PnrNumber } = req.body;
    const flightBookingResponse = await wakanow.flightTicketPnr(
      bookingId,
      PnrNumber
    );
    return res.status(200).send({
      flightBookingResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};
