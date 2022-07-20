import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "util/AuthContext";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import ListingCard from "components/ListingCard/listingCard";
import { supabaseClient as supabase } from "config/supabase-client";
import { debounce, throttle } from "lodash";
import CloseButton from "react-bootstrap/CloseButton";
import Offcanvas from "react-bootstrap/Offcanvas";
import FormCheck from "react-bootstrap/FormCheck";
import FieldTag from "components/FieldTag/fieldTag";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import ListingModal from "components/ListingModal/listingModal";
import listingsPageStyles from "./listingsPage.module.css";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import Badge from "react-bootstrap/Badge";
import { fuzzy } from "fast-fuzzy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Slider from "rc-slider";
import { FormControl, FormText } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const ListingsPage = () => {
  const { authData } = useContext(AuthContext);
  const { blocked: blockedArray } = authData;
  const unusedModalState = {
    show: false,
    username: "",
    avatarUrl: "",
    image_urls: [],
    fields: [],
    creator_id: "",
  };
  const [modalState, setModalState] = useState(unusedModalState);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ListingModal
        data={modalState}
        onHide={() => setModalState(unusedModalState)}
      />
      <ListingPageBody
        setModalState={setModalState}
        blockedArray={blockedArray}
      />
      <FooterBar />
    </div>
  );
};

export default ListingsPage;

const ListingPageBody = ({ setModalState, blockedArray }) => {
  // Options for sort field
  const sortOptions = [
    { value: "created_at desc", label: "Newest to Oldest" },
    { value: "created_at asc", label: "Oldest to Newest" },
    { value: "avg_rating desc", label: "Highest to Lowest Rating" },
    { value: "avg_rating asc", label: "Lowest to Highest Rating" },
    { value: "num_reviews desc", label: "Most to Least Reviews" },
    { value: "num_reviews asc", label: "Least to Most Reviews" },
  ];

  // Options for the targeted education level filter
  const levelOptions = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "tertiary", label: "Tertiary" },
    { value: "undergrad", label: "Undergraduate" },
    { value: "grad", label: "Graduate" },
    { value: "others", label: "Others" },
  ];

  // Options for the Subject filter
  const subjectOptions = [
    { value: "math", label: "Math" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "literature", label: "Literature" },
    { value: "geography", label: "Geography" },
  ];

  // Options for the Qualifications Filter
  const qualificationsOptions = [
    { value: "phd", label: "PhD" },
    { value: "masters", label: "Masters" },
    { value: "moe teacher", label: "MOE Teacher" },
    { value: "degree", label: "Degree" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "a levels", label: "A Levels" },
    { value: "diploma", label: "Diploma" },
    { value: "o levels", label: "O Levels" },
    { value: "psle", label: "PSLE" },
  ];

  // Stores the text of the tutor/tutee toggle
  // Loads previously saved tutor/tutee, if applicable
  const [tutorTutee, setTutorTutee] = useState(
    localStorage.getItem("lookingFor") || "tutor"
  );
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  // Stores the text entered into the search bar
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "created_at desc"
  );

  const getFilter = (filterName) =>
    filters.filter(({ name }) => name === filterName)[0];
  const checkFilterExists = (filterName) => Boolean(getFilter(filterName));

  const searchHandler = () => {
    setQuery(document.getElementById("search-input").value);
  };

  const createFilterHandler = (filterName, isMulti, setCreatableState) => {
    if (!isMulti)
      return (option, action) => {
        if (action.action === "clear")
          setFilters((old) => old.filter(({ name }) => name !== filterName));
        else
          setFilters((old) => [
            ...old,
            { name: filterName, value: option.value },
          ]);
      };
    else
      return (option, action) => {
        // Check if new option is being created
        if (action.action === "create-option") {
          setCreatableState((old) => [...old, action.option]);
        }

        if (option.length === 0)
          setFilters((old) => old.filter(({ name }) => name !== filterName));
        else
          setFilters((old) => [
            ...old.filter(({ name }) => name !== filterName),
            { name: filterName, value: option },
          ]);
      };
  };

  return (
    <>
      <Container className={`${listingsPageStyles["body"]}`}>
        {/* Header containing "I'm looking for a ..." with the Tutor/Tutee toggle */}
        <Row className={`${listingsPageStyles["filter-tutor-tutee"]}`}>
          <Col>
            <h1 className={`${listingsPageStyles["lookingForText"]}`}>
              I'm looking for a
            </h1>
          </Col>

          <Col>
            <TutorTuteeToggle
              tutorTutee={tutorTutee}
              setTutorTutee={setTutorTutee}
            />
          </Col>
        </Row>

        {/* Search Bar + Search Button */}
        <div className={listingsPageStyles["search-bar"]}>
          <div className={`${listingsPageStyles["search-box"]}`}>
            <input
              className={listingsPageStyles["input-text-1"]}
              id="search-input"
              onKeyDown={(event) => {
                if (event.key === "Enter") searchHandler();
              }}
            />
            <CloseButton
              onClick={() => {
                setQuery("");
                document.getElementById("search-input").value = "";
              }}
            />
          </div>

          <div
            className={listingsPageStyles["button-master-1"]}
            onClick={searchHandler}
          >
            <div className={`${listingsPageStyles["text-1"]}`}>Search</div>
          </div>
        </div>

        <Row className="py-2 px-3" role="menubar">
          <Col xs="auto" className="p-1" role="menuitem">
            <Select
              placeholder="Sort by..."
              options={sortOptions}
              aria-label="sort-menu"
              defaultValue={
                sortOptions.filter(({ value }) => value === sortBy) ||
                sortOptions[0]
              }
              styles={{
                control: (props) => ({
                  ...props,
                  borderRadius: "20px",
                }),
                singleValue: (props) => ({
                  ...props,
                  display: "flex",
                  justifyContent: "center",
                  "::before": {
                    content: '"Sort: "',
                    display: "block",
                    marginRight: "4px",
                    color: "gray",
                  },
                }),
              }}
              components={{
                IndicatorSeparator: () => null,
                DropdownIndicator: () => null,
              }}
              onChange={(option) => {
                setSortBy(option.value);
                localStorage.setItem("sortBy", option.value);
              }}
              isSearchable={false}
            />
          </Col>
          <Col xs="auto d-flex p-0" role="menuitem">
            <div className="vr my-auto mx-2" style={{ height: "24px" }} />
          </Col>
          <Col xs="auto" className="p-1">
            <Select
              placeholder="Level"
              options={levelOptions}
              aria-label="level-filter"
              styles={{
                control: (props) => ({
                  ...props,
                  borderRadius: "20px",
                  backgroundColor:
                    filters.filter(({ name }) => name === "level").length === 0
                      ? "white"
                      : "#d4e9e4",
                }),
                menu: (props) => ({ ...props, width: "12em" }),
                clearIndicator: (props) => ({
                  ...props,
                  paddingLeft: 0,
                }),
                valueContainer: (props) => ({ ...props, paddingRight: "0px" }),
                dropdownIndicator: (props, state) => ({
                  ...props,
                  paddingLeft: "0px",
                  display: state.getValue().length > 0 ? "none" : "flex",
                }),
                option: (props, state) => ({
                  ...props,
                  backgroundColor: state.isSelected ? "#F0F0F0" : "white",
                  color: "black",
                }),
              }}
              components={{
                IndicatorSeparator: () => null,
                MultiValueRemove: () => null,
                MultiValue: (state) => {
                  const numSelected = state.getValue().length;
                  if (numSelected > 1 && state.index > 0) return <></>;
                  return (
                    <p
                      className="m-0 ps-1 d-flex align-center"
                      style={{
                        color: "#026958",
                      }}
                    >
                      {numSelected > 1 ? "Level" : state.data.label}
                      {numSelected > 1 && (
                        <MultiBadge>{numSelected}</MultiBadge>
                      )}
                    </p>
                  );
                },
                Option: (props) => CheckboxOption(props, true),
              }}
              onChange={createFilterHandler("level", true)}
              isSearchable={false}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isClearable
              isMulti
            />
          </Col>
          <Col xs="auto" className="p-1" role="menuitem">
            <TagFilter
              tagType="subject"
              tagLabel="Subject"
              defaultOptions={subjectOptions}
              filterState={[filters, setFilters]}
              createFilterHandler={createFilterHandler}
            />
          </Col>
          <Col xs="auto" className="p-1" role="menuitem">
            <TagFilter
              tagType="qualifications"
              tagLabel="Qualifications"
              defaultOptions={qualificationsOptions}
              filterState={[filters, setFilters]}
              createFilterHandler={createFilterHandler}
            />
          </Col>
          {checkFilterExists("rates") && (
            <FilterPlaceholder
              onClose={() =>
                setFilters((old) => old.filter(({ name }) => name !== "rates"))
              }
            >{`$${getFilter("rates").value[0]} - $${
              getFilter("rates").value[1]
            }`}</FilterPlaceholder>
          )}

          <Col xs="auto" className="p-1 d-flex" role="menuitem">
            <div
              className={`${listingsPageStyles["more-filters"]} d-flex flex-row align-items-center px-2`}
              onClick={() => setShowOffcanvas(true)}
            >
              <div
                className="ps-1"
                style={{ color: "hsl(0, 0%, 50%)", cursor: "pointer" }}
              >
                <p className="m-0">More Filters</p>
              </div>
              <div className="d-flex ps-2 pe-1">
                <FontAwesomeIcon
                  icon={faAngleRight}
                  style={{ color: "hsl(0, 0%, 80%)" }}
                />
              </div>
            </div>
          </Col>
        </Row>

        {/* Legend for the listing field badge colors */}
        <div
          className="pb-2 px-sm-2 d-flex flex-row justify-center"
          style={{ fontFamily: "Nunito" }}
        >
          <h5 className="text-center">
            Tags: <span></span>
            <FieldTag category="subject" value="Subject" />
            <FieldTag category="qualifications" value="Qualifications" />
            <FieldTag category="timing" value="Preferred Times" />
            <FieldTag category="commitment" value="Commitment Period" />
            <FieldTag category="others" value="Others" />
          </h5>
        </div>
        {/* Listings */}
        <Listings
          tutorTutee={tutorTutee}
          query={query}
          setModalState={setModalState}
          blockedArray={blockedArray}
          filters={filters}
          sortBy={sortBy}
        />
      </Container>
      <FiltersOffcanvas
        showOffcanvas={showOffcanvas}
        handleClose={() => setShowOffcanvas(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

const TutorTuteeToggle = ({ tutorTutee, setTutorTutee }) => {
  // Caches tutor/tutee state 500ms after last change
  const updateLookingFor = (newState) => {
    localStorage.setItem("lookingFor", newState);
  };
  const debouncedUpdate = useRef(
    debounce(updateLookingFor, 500, { leading: false, trailing: true })
  ).current;

  const handleClick = () => {
    const newState = tutorTutee === "tutor" ? "tutee" : "tutor";
    setTutorTutee(newState);
    debouncedUpdate(newState);
  };

  return (
    <div
      className={listingsPageStyles["tutor-tutee-toggle"]}
      onClick={handleClick}
      data-testid="tutorTuteeToggle"
    >
      <div className={`${listingsPageStyles["text"]}`}>{tutorTutee}</div>
    </div>
  );
};

const Listings = ({
  tutorTutee,
  query,
  setModalState,
  blockedArray,
  filters,
  sortBy,
}) => {
  const [listingData, setListingData] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  // Set to true when data is being fetched from Supabase
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(false);

  // Dedicated useEffect to keep track of app mount status
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const filterListing = ({ level, rates, fields }) =>
    fuzzy(
      query,
      `${level} ${rates} ${Object.keys(fields).reduce(
        (acc, key) => `${acc} ${fields[key].value}`,
        ""
      )}`
    ) > 0.8;

  const createComparator = (sortBy) => {
    if (!sortBy) return () => 0;
    const [field, order] = sortBy.split(" ");
    if (order === "asc") return (a, b) => (a[field] || 0) - (b[field] || 0);
    else return (a, b) => (b[field] || 0) - (a[field] || 0);
  };

  // Fetch listings from Supabase and display using ListingCards
  useEffect(() => {
    const getListings = async () => {
      const [sortField, sortOrder] = sortBy.split(" ");
      try {
        if (mountedRef.current) setLoading(true);
        // Fetch data using `get_listings()` RPC call
        let { data: listingDb, error: listingError } = await supabase
          .rpc("get_listings")
          .eq("seeking_for", tutorTutee)
          .order(sortField, { ascending: sortOrder === "asc" });
        if (listingError) throw listingError;

        // Filter using the selected criteria
        const newListingData = listingDb.filter(filterListing);

        //if no blocked user, it will return all the listings
        if (mountedRef.current) {
          if (!blockedArray) {
            setListingData(newListingData);
          } else {
            //filter blocked user from the listing data
            const current = newListingData.filter(({ creator_id }) =>
              blockedArray.reduce(
                (cur, next) => cur && creator_id !== next,
                true
              )
            );
            setListingData(current);
          }
          setLoading(false);
        }
      } catch (error) {
        alert(error.message);
      }
    };
    getListings();

    // We are disabling the eslint warning regarding useEffect having
    // missing dependencies `listingData` and `setListingData` as
    // including them in the dependency array will cause an infinite loop.
    // (because we are actively mutating `listingData` on each call!)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorTutee, query, sortBy]);

  useEffect(() => {
    // Setup listener
    const listingSub = supabase
      .from("listings")
      .on("INSERT", async (payload) => {
        try {
          const { data: newListingData, error } = await supabase.rpc(
            "get_listings"
          );
          if (error) throw error;

          setListingData(newListingData.sort(createComparator(sortBy)));
        } catch (error) {
          alert(error.message);
        }
      })
      .on("DELETE", (payload) => {
        setListingData((oldListingData) => {
          return oldListingData.filter(
            (data) => data.listing_id !== payload.old.listing_id
          );
        });
      })
      .subscribe();

    return () => supabase.removeSubscription(listingSub);

    // We are disabling the dependency warning as we only wish to
    // run this block once, at the start.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter listings, if necessary
  useEffect(() => {
    const createFilter = ({ name, value }) => {
      if (!name && !value) return true;
      return (listing) => {
        const valueArray = value.map(({ value }) => value);
        if (name === "level") {
          if (valueArray.includes(listing.level)) return true;
        } else if (name === "rates") {
          const [lowerBound, upperBound] = value;
          const rates = listing.rates;
          if (rates >= lowerBound && rates <= upperBound) return true;
        } else {
          const relevantFields = listing.fields.filter(
            ({ category }) => category === name
          );
          for (let filterVal of value)
            for (let field of relevantFields)
              if (fuzzy(filterVal.value, field.value) > 0.8) return true;
        }
        return false;
      };
    };
    if (filters.length === 0) setFilteredListings(listingData);
    else
      setFilteredListings(
        listingData.filter((listing) =>
          filters.reduce(
            (acc, filterData) => acc && createFilter(filterData)(listing),
            true
          )
        )
      );
  }, [filters, listingData]);

  return (
    <div className={listingsPageStyles["listings"]}>
      {loading ? (
        <Spinner animation="border" role="status" aria-label="Loading" />
      ) : filteredListings.length === 0 ? (
        <h1>Nothing here!</h1>
      ) : (
        <React.Fragment>
          {filteredListings.map(
            ({
              avatar_url,
              username,
              level,
              rates,
              fields,
              image_urls,
              listing_id,
              creator_id,
              avg_rating,
            }) => {
              return (
                <ListingCard
                  avatarUrl={
                    avatar_url &&
                    supabase.storage.from("avatars").getPublicUrl(avatar_url)
                      .publicURL
                  }
                  username={username}
                  key={listing_id}
                  listing_id={listing_id}
                  level={level}
                  rates={rates}
                  image_urls={image_urls}
                  fields={fields}
                  setModalState={setModalState}
                  creator_id={creator_id}
                  avg_rating={avg_rating}
                />
              );
            }
          )}
        </React.Fragment>
      )}
    </div>
  );
};

const MultiBadge = ({ children }) => (
  <Badge
    bg="success"
    className="ms-2 my-auto"
    style={{ padding: "4px 6px" }}
    pill
  >
    {children}
  </Badge>
);

const TagFilter = ({
  tagType,
  tagLabel,
  defaultOptions,
  filterState: [filters, setFilters],
  createFilterHandler,
}) => {
  const [options, setOptions] = useState(defaultOptions);

  const removeOption = (props, event) => {
    const toRemove = props.value;
    if (!props.hasValue) event.stopPropagation();
    setOptions((old) => old.filter(({ value }) => value !== toRemove));
  };

  return (
    <CreatableSelect
      options={options}
      placeholder={tagLabel}
      aria-label={`${tagType}-filter`}
      styles={{
        control: (props) => ({
          ...props,
          borderRadius: "20px",
          backgroundColor:
            filters.filter(({ name }) => name === tagType).length === 0
              ? "white"
              : "#d4e9e4",
        }),
        menu: (props) => ({ ...props, width: "12em" }),
        clearIndicator: (props) => ({
          ...props,
          paddingLeft: 0,
        }),
        valueContainer: (props) => ({ ...props, paddingRight: "0px" }),
        dropdownIndicator: (props, state) => ({
          ...props,
          paddingLeft: "0px",
          display: state.getValue().length > 0 ? "none" : "flex",
        }),
        option: (props, state) => ({
          ...props,
          backgroundColor: state.isSelected ? "#F0F0F0" : "white",
          color: "black",
        }),
      }}
      components={{
        IndicatorSeparator: () => null,
        MultiValueRemove: () => null,
        MultiValue: (state) => {
          const numSelected = state.getValue().length;
          if (numSelected > 1 && state.index > 0) return <></>;
          return (
            <p
              className="m-0 px-1 d-flex align-center"
              style={{
                color: "#026958",
              }}
            >
              {numSelected > 1 ? tagLabel : state.data.label}
              {numSelected > 1 && <MultiBadge>{numSelected}</MultiBadge>}
            </p>
          );
        },
        Option: (props) =>
          CheckboxOption(
            props,
            defaultOptions.filter(({ value }) => value === props.value).length >
              0,
            removeOption
          ),
      }}
      onChange={createFilterHandler(tagType, true, setOptions)}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      isClearable
      isMulti
    />
  );
};

const CheckboxOption = (props, isDefault, removeOption) => (
  <div>
    <components.Option {...props} className="d-flex align-items-center">
      <input
        type="checkbox"
        checked={props.isSelected}
        className="me-2"
        readOnly
      />
      <label>{props.label}</label>
      {isDefault || props.data.label.includes('Create "') || (
        <CloseButton
          className="ms-auto"
          onClick={(event) => removeOption(props, event)}
        />
      )}
    </components.Option>
  </div>
);

const FilterPlaceholder = (props) => {
  const { onClose, children } = props;
  return (
    <Col xs="auto" className="p-1 d-flex" role="menuitem">
      <div
        className="d-flex flex-row align-items-center px-2"
        style={{
          borderWidth: "1px",
          borderColor: "hsl(0, 0%, 80%)",
          borderRadius: "20px",
          backgroundColor: "#d4e9e4",
        }}
      >
        <div className="ps-1">
          <p className="m-0" style={{ color: "rgb(2, 105, 88)" }}>
            {children}
          </p>
        </div>
        <div className="d-flex ps-2 pe-1">
          <CloseButton
            onClick={onClose}
            className="p-0 my-auto"
            style={{
              height: "12px",
              width: "12px",
            }}
          />
        </div>
      </div>
    </Col>
  );
};

const FiltersOffcanvas = ({
  showOffcanvas,
  handleClose,
  filters,
  setFilters,
}) => {
  const [rates, setRates] = useState([0, 100]);
  const [rating, setRating] = useState([0, 5]);
  const [useFullRates, setUseFullRates] = useState(false);
  const debouncedUpdateFilters = useRef(
    debounce(
      (filterName, value) =>
        setFilters((old) => [
          ...old.filter(({ name }) => name !== filterName),
          { name: filterName, value },
        ]),
      250
    )
  );
  const throttledHandlers = useRef({
    setRates: throttle((value) => setRates(value), 10),
    setRating: throttle((value) => setRating(value), 10),
  });

  const getFilter = (filterName) =>
    filters.filter(({ name }) => name === filterName);
  const checkFilterExists = (filterName) => getFilter(filterName).length > 0;
  const handleRatesChange = (value, index) => {
    // Check if value is within [0, 999]
    if (value < 0 || value > 999) return;

    // Create new state
    const newRates = index === 0 ? [value, rates[1]] : [rates[0], value];

    // Check if values overlap
    if (Number(newRates[0]) > Number(newRates[1])) return;

    setRates(newRates);
  };
  const handleRatingChange = (value, index) => {
    // Check if value is within [0, 5]
    if (value < 0 || value > 5) return;

    // Create new state
    const newRating = index === 0 ? [value, rating[1]] : [rating[0], value];

    // Check if values overlap
    if (Number(newRating[0]) > Number(newRating[1])) return;

    setRating(newRating);
  };

  const handleCheck = (filterName, isChecked) => {
    if (isChecked) {
      setFilters((old) => [...old, { name: filterName, value: rates }]);
    } else {
      setFilters((old) => old.filter(({ name }) => name !== filterName));
    }
  };

  // Update main `filters` state when rates changes (debounced)
  useEffect(() => {
    if (checkFilterExists("rates"))
      debouncedUpdateFilters.current("rates", rates);

    // Disabling warning as checkFilterExists will never be modified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rates]);

  // Update main `filters` state when rating changes (debounced)
  useEffect(() => {
    if (checkFilterExists("avg_rating"))
      debouncedUpdateFilters.current("avg_rating", rating);

    // Disabling warning as checkFilterExists will never be modified
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  return (
    <Offcanvas
      show={showOffcanvas}
      onHide={handleClose}
      placement="end"
      scroll
      backdrop
    >
      <Container className="p-4 mx-2">
        <Row className="px-3 py-2">
          <Row>
            <FormCheck
              type="checkbox"
              label="Hourly Rates"
              defaultChecked={checkFilterExists("rating")}
              onChange={(event) => handleCheck("rates", event.target.checked)}
              style={{ fontSize: "18px" }}
            />
          </Row>
          <Row className="my-4">
            <Slider
              range
              max={useFullRates ? 999 : 100}
              allowCross={false}
              onChange={throttledHandlers.current.setRates}
              value={rates}
              defaultValue={[0, 999]}
              className="my-1"
              disabled={!checkFilterExists("rates")}
            />
            <FormCheck
              type="checkbox"
              label="Show full range"
              defaultChecked={useFullRates}
              onChange={(event) => {
                setUseFullRates(event.target.checked);
                setRates((old) => [
                  Math.min(100, old[0]),
                  Math.min(100, old[1]),
                ]);
              }}
              disabled={!checkFilterExists("rates")}
            />
          </Row>
          <Row className="d-flex align-items-center justify-content-between px-0">
            <Col className="d-flex flex-row align-items-center">
              <label className="px-1">$</label>
              <FormControl
                type="number"
                value={rates[0]}
                onChange={(e) => handleRatesChange(e.target.value, 0)}
                disabled={!checkFilterExists("rates")}
              />
            </Col>
            -
            <Col className="d-flex flex-row align-items-center">
              <label className="px-1">$</label>
              <FormControl
                type="number"
                value={rates[1]}
                onChange={(e) => handleRatesChange(e.target.value, 1)}
                disabled={!checkFilterExists("rates")}
              />
            </Col>
          </Row>
        </Row>

        <hr style={{ border: "1px 0px" }} className="my-4" />

        <Row className="px-3 py-2">
          <FormCheck
            type="checkbox"
            label="Average Rating"
            defaultChecked={checkFilterExists("avg_rating")}
            onChange={(event) =>
              handleCheck("avg_rating", event.target.checked)
            }
            style={{ fontSize: "18px" }}
          />
          <Row className="my-4">
            <Slider
              range
              max={5}
              allowCross={false}
              value={rating}
              onChange={throttledHandlers.current.setRating}
              className="my-1"
              disabled={!checkFilterExists("avg_rating")}
              defaultValue={[0, 5]}
            />
          </Row>
          <Row className="d-flex align-items-center justify-content-between px-0">
            <Col className="d-flex flex-row align-items-center">
              <FormControl
                type="number"
                value={rating[0]}
                onChange={(e) => handleRatingChange(e.target.value, 0)}
                disabled={!checkFilterExists("avg_rating")}
              />
              <FaStar
                color={checkFilterExists("avg_rating") ? "#FFBA5A" : "#a9a9a9"}
              />
            </Col>
            -
            <Col className="d-flex flex-row align-items-center">
              <FormControl
                type="number"
                value={rating[1]}
                onChange={(e) => handleRatingChange(e.target.value, 1)}
                disabled={!checkFilterExists("avg_rating")}
              />
              <FaStar
                color={checkFilterExists("avg_rating") ? "#FFBA5A" : "#a9a9a9"}
              />
            </Col>
          </Row>
        </Row>
      </Container>
    </Offcanvas>
  );
};
