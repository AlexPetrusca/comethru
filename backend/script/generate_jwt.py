#!/usr/bin/env python3
"""
generate_jwt.py

Usage examples:
    python generate_jwt.py --duration "1 YEAR"
    python generate_jwt.py --duration "10 DAY" --private-key ./private_key.pem

Duration formats supported:
    - "1 DAY", "10 DAYS", "WEEK", "2 Weeks", "3 month", "1 YEAR", etc.
If number is omitted (e.g. "WEEK") it defaults to 1.
Note: MONTH = 30 days, YEAR = 365 days (approximate).
"""

import argparse
import re
import sys
from datetime import datetime, timezone

import jwt

# Approximate seconds per unit
_SECONDS = {
    "DAY": 24 * 60 * 60,
    "WEEK": 7 * 24 * 60 * 60,
    "MONTH": 30 * 24 * 60 * 60,   # approximation
    "YEAR": 365 * 24 * 60 * 60,   # approximation
}


def parse_duration(duration_str: str):
    """
    Parse a duration string like '1 YEAR' or '10 DAY' or 'WEEK' -> (amount:int, unit:str)
    Raises ValueError on invalid input.
    """
    if not duration_str or not duration_str.strip():
        raise ValueError("duration must be a non-empty string")

    s = duration_str.strip().upper()
    # Accept formats like "10 DAY", "DAY", "2WEEKS", "3 MONTHS"
    m = re.match(r"^\s*(\d+)?\s*([A-Z]+)\s*$", s)
    if not m:
        raise ValueError(
            "Invalid duration format. Examples: '1 YEAR', '10 DAY', 'WEEK', '3 months'"
        )
    num_part = m.group(1)
    unit_part = m.group(2)

    amount = int(num_part) if num_part else 1

    # Normalize unit (allow plurals and abbreviations)
    # Convert common abbreviations/variants to canonical unit keys used in _SECONDS
    unit_map = {
        "D": "DAY",
        "DAY": "DAY",
        "DAYS": "DAY",
        "W": "WEEK",
        "WEEK": "WEEK",
        "WEEKS": "WEEK",
        "WK": "WEEK",
        "M": "MONTH",     # ambiguous but accept
        "MON": "MONTH",
        "MONTH": "MONTH",
        "MONTHS": "MONTH",
        "Y": "YEAR",
        "YR": "YEAR",
        "YEAR": "YEAR",
        "YEARS": "YEAR",
    }

    unit = unit_map.get(unit_part)
    if unit is None:
        # try stripping trailing S and lookup
        unit_singular = unit_part.rstrip("S")
        unit = unit_map.get(unit_singular)
    if unit is None:
        raise ValueError(f"Unknown duration unit '{unit_part}'. Use DAY/WEEK/MONTH/YEAR.")

    return amount, unit


def create_jwt(private_key_path: str, duration: str, subject: str = "+16509963084"):
    """
    Create a JWT signed with RS256, with iat=now and exp=now+duration.
    Returns the token string.
    """
    # Read private key
    with open(private_key_path, "r") as f:
        private_key = f.read()

    now = datetime.now(timezone.utc)
    iat = int(now.timestamp())

    amount, unit = parse_duration(duration)
    delta_seconds = amount * _SECONDS[unit]
    exp = iat + int(delta_seconds)

    header = {"alg": "RS256"}
    payload = {
        "iss": "self",
        "sub": subject,
        "iat": iat,
        "exp": exp,
        "scope": "ROLE_USER",
    }

    token = jwt.encode(payload, private_key, algorithm="RS256", headers=header)

    return token


def main(argv):
    parser = argparse.ArgumentParser(description="Generate RS256 JWT with duration from now.",
                                     epilog='Examples: python generate_jwt.py --duration "10 DAY" --sub "+1234567890"')
    parser.add_argument(
        "--private-key",
        "-k",
        default="../src/main/resources/certs/private_key.pem",
        help="Path to RSA private key PEM file. Default ./src/main/resources/certs/private_key.pem",
    )
    parser.add_argument(
        "--duration",
        "-d",
        default="1 DAY",
        help='Duration (e.g. "1 YEAR", "10 DAY", "WEEK", "3 months"). Default "1 YEAR".',
    )
    parser.add_argument(
        "--sub",
        "-s",
        default="+1234567890",
        help="Subject (sub) claim. Default +1234567890.",
    )

    args = parser.parse_args(argv)

    try:
        token = create_jwt(args.private_key, args.duration, subject=args.sub)
    except Exception as e:
        print("Error:", e, file=sys.stderr)
        sys.exit(2)

    print("\nJWT token:\n")
    print(token)
    print()


if __name__ == "__main__":
    main(sys.argv[1:])
